import logging
import pandas as pd
from typing import Dict
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

# Configure the logging module
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataLoader:
    """
    DataLoader class for uploading and configuring tables in a PostgreSQL database.
    """

    def __init__(self, db_engine, schema: str, table_names: dict) -> None:
        """
        Initialise the DataLoader instance.

        Args:
            db_engine: SQLAlchemy database engine.
            schema (str): Schema name in the PostgreSQL database.
            table_names (dict): Dictionary of table names.
        """
        self.db_engine = db_engine
        self.schema = schema
        self.table_names = table_names

    def __upload_to_db(self, df: pd.DataFrame, table_name: str, schema: str) -> None:
        """
        Uploads a Pandas DataFrame to the specified table in the connected database.

        Args:
            df (pd.DataFrame): DataFrame to be uploaded.
            table_name (str): Name of the table in the database.
            schema (str): Schema name in the database.
        """
        try:
            with self.db_engine.connect() as connection:
                df.to_sql(table_name, connection, schema=schema, if_exists='replace', index=False)
            logger.info(f"Data uploaded to table {schema}.{table_name} successfully.")
        except SQLAlchemyError as error:
            logger.error(f"Error uploading DataFrame to table {schema}.{table_name}: {error}")
            raise

    def __cast_data_types(self, table_name: str, schema: str, column_types: Dict[str, str]) -> None:
        """
        Casts the data types of columns in a PostgreSQL table based on the provided dictionary of column types.

        Args:
            table_name (str): The name of the PostgreSQL table.
            schema (str): Schema name in the database.
            column_types (Dict[str, str]): A dictionary where keys are column names and values are the desired data types.
        """
        try:
            with self.db_engine.connect() as conn:
                for column_name, data_type in column_types.items():
                    if data_type == 'VARCHAR(?)':
                        query = text(f"SELECT MAX(CHAR_LENGTH(CAST({column_name} AS VARCHAR))) FROM {schema}.{table_name};")
                        max_length = conn.execute(query).scalar()
                        alter_query = text(f"ALTER TABLE {schema}.{table_name} ALTER COLUMN {column_name} TYPE VARCHAR({max_length});")
                    else:
                        alter_query = text(f"ALTER TABLE {schema}.{table_name} ALTER COLUMN {column_name} TYPE {data_type} USING {column_name}::{data_type};")
                    conn.execute(alter_query)
                conn.commit()
            logger.info(f"Data types casted for table {schema}.{table_name} successfully.")
        except SQLAlchemyError as error:
            logger.error(f"Error updating column data types for {schema}.{table_name}: {error}")
            raise RuntimeError(f"Error updating column data types for {schema}.{table_name}: {error}")

    def __check_key_exists(self, table_name: str, schema: str, key: str) -> bool:
        """
        Checks if a primary or foreign key constraint exists in the specified table.

        Args:
            table_name (str): The name of the PostgreSQL table.
            schema (str): Schema name in the database.
            key (str): PRIMARY KEY or FOREIGN KEY

        Returns:
            bool: True if a key exists, False otherwise.
        """
        query = text(
            f"""
            SELECT 1
            FROM information_schema.table_constraints tc
            WHERE tc.table_name = :table_name 
            AND tc.table_schema = :schema 
            AND tc.constraint_type = :key
            """
        )
        try:
            with self.db_engine.connect() as conn:
                result = conn.execute(query, {'table_name': table_name, 'schema': schema, 'key': key}).fetchone()
                return result is not None
        except SQLAlchemyError as error:
            logger.error(f"Error checking {key} in table {schema}.{table_name}: {error}")
            return False

    def __add_primary_key(self, table_name: str, schema: str, primary_key: str) -> None:
        """
        Adds a primary key constraint to a PostgreSQL table.

        Args:
            table_name (str): The name of the PostgreSQL table.
            schema (str): Schema name in the database.
            primary_key (str): The column name or a comma-separated list of column names for the primary key.
        """
        try:
            with self.db_engine.connect() as conn:
                alter_query = text(f"ALTER TABLE {schema}.{table_name} ADD PRIMARY KEY({primary_key});")
                conn.execute(alter_query)
                conn.commit()
            logger.info(f"Primary key added to table {schema}.{table_name} successfully.")
        except SQLAlchemyError as error:
            logger.error(f"Error adding primary key to table {schema}.{table_name}: {error}")
            raise RuntimeError(f"Error adding primary key to table {schema}.{table_name}: {error}")

    def __add_foreign_key(self, table_name: str, schema: str, foreign_keys: Dict[str, str]) -> None:
        """
        Adds foreign key constraints to a PostgreSQL table based on the provided dictionary of foreign keys.

        Args:
            table_name (str): The name of the PostgreSQL table.
            schema (str): Schema name in the database.
            foreign_keys (Dict[str, str]): A dictionary where keys are reference table names and values are foreign key column names.
        """
        try:
            with self.db_engine.connect() as conn:
                for reference_table, foreign_key in foreign_keys.items():
                    alter_query = text(f"ALTER TABLE {schema}.{table_name} ADD FOREIGN KEY ({foreign_key}) REFERENCES {schema}.{reference_table}({foreign_key});")
                    conn.execute(alter_query)
                    conn.commit()
            logger.info(f"Foreign keys added to table {schema}.{table_name} successfully.")
        except SQLAlchemyError as error:
            logger.error(f"Error adding foreign key to table {schema}.{table_name}: {error}")
            raise RuntimeError(f"Error adding foreign key to table {schema}.{table_name}: {error}")

    def __grant_access(self, table_name: str, schema: str) -> None:
        """
        Grant select access to PostgreSQL table.

        Args:
            table_name (str): The name of the PostgreSQL table.
            schema (str): Schema name in the database.
        """
        try:
            with self.db_engine.connect() as conn:
                query = text(f"GRANT SELECT, INSERT, UPDATE, DELETE ON {schema}.{table_name} TO df_student;")
                conn.execute(query)
                conn.commit()
            logger.info(f"Access granted to table {schema}.{table_name} successfully.")
        except SQLAlchemyError as error:
            logger.error(f"Error granting access for {schema}.{table_name}: {error}")
            raise RuntimeError(f"Error granting access for {schema}.{table_name}: {error}")

    def _upload_data(
            self, 
            organization_df: pd.DataFrame,
            dependencies_df: pd.DataFrame, 
            type_df: pd.DataFrame, 
            modality_df: pd.DataFrame, 
            size_df: pd.DataFrame, 
            access_df: pd.DataFrame, 
            license_df: pd.DataFrame, 
            model_df: pd.DataFrame, 
            model_organization_df: pd.DataFrame,
            model_dependencies_df: pd.DataFrame
        ) -> None:
        """
        Upload and configure data for tables in the database.

        Args:
            **dataframes: DataFrames containing data for each table.
        """
        # Define column types for each table
        organization_column_types = {'organization_id': 'INT', 'organization': 'VARCHAR(?)', 'organization_logo_url': 'VARCHAR(256)'}
        dependencies_column_types = {'dependencies_id': 'INT', 'dependencies': 'VARCHAR(256)'}
        type_column_types = {'type_id': 'INT', 'type': 'VARCHAR(?)'}
        modality_column_types = {'modality_id': 'INT', 'modality': 'VARCHAR(?)'}
        size_column_types = {'size_id': 'INT', 'size': 'VARCHAR(?)'}
        access_column_types = {'access_id': 'INT', 'access': 'VARCHAR(?)'}
        license_column_types = {'license_id': 'INT', 'license': 'VARCHAR(?)'}
        model_column_types = {
            'model_id': 'INT',
            'type_id': 'INT',
            'modality_id': 'INT',
            'size_id': 'INT',
            'access_id': 'INT',
            'license_id': 'INT',
            'name': 'VARCHAR(?)',
            'description': 'VARCHAR(?)',
            'created_date': 'VARCHAR(?)',
            'url': 'VARCHAR(?)',
            'datasheet': 'VARCHAR(?)',
            'sample': 'VARCHAR(?)',
            'analysis': 'VARCHAR(?)',
            'included': 'VARCHAR(?)',
            'excluded': 'VARCHAR(?)',
            'quality_control': 'VARCHAR(?)',
            'intended_uses': 'VARCHAR(?)',
            'prohibited_uses': 'VARCHAR(?)',
            'monitoring': 'VARCHAR(?)',
            'feedback': 'VARCHAR(?)',
            'model_card': 'VARCHAR(?)',
            'training_emissions': 'VARCHAR(?)',
            'training_time': 'VARCHAR(?)',
            'training_hardware': 'VARCHAR(?)',
            'adaptation': 'VARCHAR(?)',
            'output_space': 'VARCHAR(?)',
            'terms_of_service': 'VARCHAR(?)',
            'monthly_active_users': 'VARCHAR(?)',
            'user_distribution': 'VARCHAR(?)',
            'failures': 'VARCHAR(?)',
        }
        model_organization_column_types = {'model_id': 'INT', 'organization_id': 'INT'}
        model_dependencies_column_types = {'model_id': 'INT', 'dependencies_id': 'INT'}

        # Define primary keys for each table
        primary_keys = {
            self.table_names['organization_table']: 'organization_id',
            self.table_names['dependencies_table']: 'dependencies_id',
            self.table_names['type_table']: 'type_id',
            self.table_names['modality_table']: 'modality_id',
            self.table_names['size_table']: 'size_id',
            self.table_names['access_table']: 'access_id',
            self.table_names['license_table']: 'license_id',
            self.table_names['model_table']: 'model_id',
            self.table_names['model_organization_table']: None,
            self.table_names['model_dependencies_table']: None
        }

        # Define foreign keys for each table
        foreign_keys = {
            self.table_names['organization_table']: {},
            self.table_names['dependencies_table']: {},
            self.table_names['type_table']: {},
            self.table_names['modality_table']: {},
            self.table_names['size_table']: {},
            self.table_names['access_table']: {},
            self.table_names['license_table']: {},
            self.table_names['model_table']: {
                'de10_na_horizonx_type': 'type_id',
                'de10_na_horizonx_modality': 'modality_id', 
                'de10_na_horizonx_size': 'size_id', 
                'de10_na_horizonx_access': 'access_id', 
                'de10_na_horizonx_license': 'license_id'
                },
            self.table_names['model_organization_table']: {
                'de10_na_horizonx_organization': 'organization_id', 
                'de10_na_horizonx_model': 'model_id'
                },
            self.table_names['model_dependencies_table']: {
                'de10_na_horizonx_dependencies': 'dependencies_id', 
                'de10_na_horizonx_model': 'model_id'
                }
        }

        # Upload data to each table
        table_data = [
            (organization_df, self.table_names['organization_table'], organization_column_types),
            (dependencies_df, self.table_names['dependencies_table'], dependencies_column_types),
            (type_df, self.table_names['type_table'], type_column_types),
            (modality_df, self.table_names['modality_table'], modality_column_types),
            (size_df, self.table_names['size_table'], size_column_types),
            (access_df, self.table_names['access_table'], access_column_types),
            (license_df, self.table_names['license_table'], license_column_types),
            (model_df, self.table_names['model_table'], model_column_types),
            (model_organization_df, self.table_names['model_organization_table'], model_organization_column_types),
            (model_dependencies_df, self.table_names['model_dependencies_table'], model_dependencies_column_types)
        ]

        # Upload and configure tables in PostgreSQL
        try:
            for df, table_name, column_types in table_data:
                self.__upload_to_db(df, table_name, self.schema)
                self.__cast_data_types(table_name, self.schema, column_types)
                primary_key = primary_keys.get(table_name)
                if primary_key and not self.__check_key_exists(table_name, self.schema, 'PRIMARY KEY'):
                    self.__add_primary_key(table_name, self.schema, primary_key)
                fk_dict = foreign_keys.get(table_name, {})
                if fk_dict and not self.__check_key_exists(table_name, self.schema, 'FOREIGN KEY'):
                    self.__add_foreign_key(table_name, self.schema, fk_dict)
                self.__grant_access(table_name, self.schema)
            logger.info("Cleaned data loaded to PostgreSQL tables")
        except Exception as e:
            logger.error(f"Error uploading and configuring tables: {e}")
            raise RuntimeError(f"Error uploading and configuring tables: {e}")
