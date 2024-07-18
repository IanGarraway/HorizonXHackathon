import logging
import pandas as pd
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from typing import Any, List, Dict, Tuple, Optional

# Configure the logging module
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataProcessor:
    def __init__(self, db_engine, file_path: str) -> None:
        """
        Initialise the DataProcessor with the path to the CSV file.

        Args:
            db_engine: SQLAlchemy engine for database connection.
            file_path (str): Path to the CSV file.
        """
        self.db_engine = db_engine
        self.file_path = file_path
        self.df: Optional[pd.DataFrame] = None
        logger.info(f"DataProcessor initialised with file path: {self.file_path}")

    def __check_table_exists(self, schema: str, table_name: str) -> bool:
        """
        Check if a table exists in the database schema.

        Args:
            schema (str): Schema name in the database.
            table_name (str): The name of the table to check.

        Returns:
            bool: True if the table exists, False otherwise.
        """
        try:
            with self.db_engine.connect() as conn:
                query = text("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = :schema AND table_name = :table_name)")
                result = conn.execute(query, {'schema': schema, 'table_name': table_name}).scalar()
                return result
        except SQLAlchemyError as e:
            logger.error(f"Error checking table existence for {schema}.{table_name}: {e}")
            return False

    def __fetch_table_as_dataframe(self, schema, table_name: str) -> pd.DataFrame:
        """
        Fetch the entire table from the database and return it as a DataFrame.

        Args:
            schema (str): Schema name in the database.
            table_name (str): The name of the table to fetch.

        Returns:
            pd.DataFrame: DataFrame containing the table data.
        """
        if not self.__check_table_exists(schema, table_name):
            logger.warning(f"Table {schema}.{table_name} does not exist.")
            return pd.DataFrame()
        try:
            with self.db_engine.connect() as conn:
                query = f"SELECT * FROM {schema}.{table_name}"
                df = pd.read_sql(query, conn)
                return df
        except SQLAlchemyError as e:
            logger.error(f"Error fetching table {schema}.{table_name}: {e}")
            return pd.DataFrame()

    def __load_data(self) -> None:
        """Load data from the CSV file into a DataFrame."""
        try:
            self.df = pd.read_csv(self.file_path)
            logger.info(f"Data loaded successfully from {self.file_path}")
        except FileNotFoundError:
            logger.error(f"Error: The file at {self.file_path} was not found.")
            raise
        except pd.errors.ParserError:
            logger.error(f"Error: Failed to parse the CSV file at {self.file_path}.")
            raise
        except Exception as e:
            logger.error(f"Error: An unexpected error occurred while loading the file at {self.file_path}: {e}")
            raise

    def __preprocess_data(self) -> None:
        """Preprocess the DataFrame."""
        if self.df is None:
            logger.error("Error: DataFrame is not loaded. Please load the data first.")
            raise ValueError("DataFrame is not loaded. Please load the data first.")

        try:
            self.df['created_date'] = pd.to_datetime(self.df['created_date'], format='ISO8601', errors='coerce')
            #self.df['llms_id'] = range(1, len(self.df) + 1)
            logger.info("Data preprocessing completed successfully.")
        except KeyError as e:
            logger.error("Error: Missing 'created_date' column in the data.")
            raise e
        except Exception as e:
            logger.error("Error: An unexpected error occurred during preprocessing.")
            raise e

    def _load_and_process_data(self) -> pd.DataFrame:
        """Load and preprocess the data and return the DataFrame."""
        self.__load_data()
        self.__preprocess_data()
        logger.info("Data loading and processing completed successfully.")
        return self.df

    def process_llm_data(self, schema: str, table_names: Dict[str, str]) -> Tuple[pd.DataFrame, ...]:
        """
        Process large language model data into DataFrames.

        Args:
            schema (str): Database schema.
            table_names (Dict[str, str]): Mapping of logical table names to actual table names.

        Returns:
            Tuple[pd.DataFrame, ...]: DataFrames for organisations, types, modalities, sizes, dependencies, access, licenses, and LLMs.
        """
        existing_dataframes = {
            key: self.__fetch_table_as_dataframe(schema, table_names[key]) 
            for key in ['organisation_table', 'type_table', 'modality_table', 'size_table', 'dependencies_table', 'access_table', 'license_table', 'llms_table']
        }
        
        id_counters = {key: 1 for key in existing_dataframes}
        id_maps = {key: {} for key in existing_dataframes}
        
        def populate_id_map(df, id_map, id_col, key_col):
            counter = id_counters[key_col]
            for _, row in df.iterrows():
                key = row[key_col]
                id_map[key] = row[id_col]
                counter = max(counter, row[id_col] + 1)
            id_counters[key_col] = counter

        for key in existing_dataframes:
            df = existing_dataframes[key]
            if not df.empty:
                populate_id_map(df, id_maps[key], f"{key}_id", key.replace('_table', ''))
        
        self._load_and_process_data()

        organisation, type, modality, size, dependencies, access, license, llms = [], [], [], [], [], [], [], []

        for _, result in self.df.iterrows():
            # Organisation processing
            organisation_val = result['organization']
            if organisation_val not in id_maps['organisation_table']:
                id_maps['organisation_table'][organisation_val] = id_counters['organisation_table']
                organisation.append({'organisation_id': id_counters['organisation_table'], 'organization': organisation_val})
                id_counters['organisation_table'] += 1

            # Type processing
            type_val = result['type']
            if type_val not in id_maps['type_table']:
                id_maps['type_table'][type_val] = id_counters['type_table']
                type.append({'type_id': id_counters['type_table'], 'type': type_val})
                id_counters['type_table'] += 1

            # Modality processing
            modality_val = result['modality']
            if modality_val not in id_maps['modality_table']:
                id_maps['modality_table'][modality_val] = id_counters['modality_table']
                modality.append({'modality_id': id_counters['modality_table'], 'modality': modality_val})
                id_counters['modality_table'] += 1

            # Size processing
            size_val = result['size']
            if size_val not in id_maps['size_table']:
                id_maps['size_table'][size_val] = id_counters['size_table']
                size.append({'size_id': id_counters['size_table'], 'size': size_val})
                id_counters['size_table'] += 1

            # Dependencies processing
            dependencies_val = result['dependencies']
            if dependencies_val not in id_maps['dependencies_table']:
                id_maps['dependencies_table'][dependencies_val] = id_counters['dependencies_table']
                dependencies.append({'dependencies_id': id_counters['dependencies_table'], 'dependencies': dependencies_val})
                id_counters['dependencies_table'] += 1

            # Access processing
            access_val = result['access']
            if access_val not in id_maps['access_table']:
                id_maps['access_table'][access_val] = id_counters['access_table']
                access.append({'access_id': id_counters['access_table'], 'access': access_val})
                id_counters['access_table'] += 1

            # License processing
            license_val = result['license']
            if license_val not in id_maps['license_table']:
                id_maps['license_table'][license_val] = id_counters['license_table']
                license.append({'license_id': id_counters['license_table'], 'license': license_val})
                id_counters['license_table'] += 1

            # LLM processing
            llm_val = result['name']
            if llm_val not in id_maps['llms_table']:
                id_maps['llms_table'][llm_val] = id_counters['llms_table']
                llms.append({
                    'llms_id': id_counters['llms_table'], 
                    'name': llm_val, 
                    'organisation_id': id_maps['organisation_table'][organisation_val],
                    'type_id': id_maps['type_table'][type_val],
                    'modality_id': id_maps['modality_table'][modality_val],
                    'size_id': id_maps['size_table'][size_val],
                    'dependencies_id': id_maps['dependencies_table'][dependencies_val],
                    'access_id': id_maps['access_table'][access_val],
                    'license_id': id_maps['license_table'][license_val],
                    'created_date': result['created_date']
                })
                id_counters['llms_table'] += 1

        # Convert lists to DataFrames
        organisation_df = pd.DataFrame(organisation)
        type_df = pd.DataFrame(type)
        modality_df = pd.DataFrame(modality)
        size_df = pd.DataFrame(size)
        dependencies_df = pd.DataFrame(dependencies)
        access_df = pd.DataFrame(access)
        license_df = pd.DataFrame(license)
        llms_df = pd.DataFrame(llms)

        # Deduplicate LLMs DataFrame if necessary
        if not existing_dataframes['llms_table'].empty:
            llms_df = llms_df.merge(
                existing_dataframes['llms_table'], 
                on=['name', 'organisation_id', 'type_id', 'modality_id', 'size_id', 'dependencies_id', 'access_id', 'license_id', 'created_date'], 
                how='outer', 
                indicator=True
            )
            llms_df = llms_df[llms_df['_merge'] == 'left_only'].drop(columns=['_merge'])
            llms_df = llms_df.drop_duplicates(subset=['name', 'organisation_id', 'type_id', 'modality_id', 'size_id', 'dependencies_id', 'access_id', 'license_id', 'created_date']).reset_index(drop=True)

        return organisation_df, type_df, modality_df, size_df, dependencies_df, access_df, license_df, llms_df
