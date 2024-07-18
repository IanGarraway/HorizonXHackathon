import logging
from decouple import config

from classes.data_processor import DataProcessor  # Custom class for data processing
from classes.db_connector import DBConnector  # Custom class for database connection
from classes.data_loader import DataLoader  # Custom class for data loading

# Configure the logging module
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Processor:
    """
    Processor class to manage data processing and loading.
    """

    def __init__(self, file_path: str, schema: str, table_names: dict) -> None:
        """
        Initialise the Processor instance.

        Args:
            file_path (str): Path to the CSV file containing the data.
            schema (str): Schema name in the PostgreSQL database.
            table_names (dict): Dictionary of table names.
        """
        self.db_connector = DBConnector()  # Create a database connector instance
        self.data_processor = DataProcessor(file_path)  # Create a data processor instance
        self.data_loader = DataLoader(self.db_connector.db_engine, schema, table_names)  # Create a data loader instance
        self.schema = schema
        self.table_names = table_names

    def fetch_process_load_data(self) -> None:
        """
        Fetch, process, and load data into the database.
        """
        try:
            # Process data
            organization_df, dependencies_df, type_df, modality_df, size_df, access_df, license_df, model_df, model_organization_df, model_dependencies_df = self.data_processor._load_and_process_data()

            # Upload and configure data
            self.data_loader._upload_data(organization_df, dependencies_df, type_df, modality_df, size_df, access_df, license_df, model_df, model_organization_df, model_dependencies_df)

            logger.info("Cleaned data loaded to PostgreSQL tables successfully.")
        except Exception as e:
            logger.error(f"An error occurred: {e}")

def main() -> None:
    """
    Main function to fetch air quality data, process it, and load it into PostgreSQL tables.
    """
    try:
        # Load configuration
        file_path = 'Portfolio-Github/HorizonXHackathon/data_engineering/data/assets.csv'  # Path to the data file

        schema = 'student'  # Schema name
        table_names = {  # Dictionary of table names
            'organization_table': 'de10_na_horizonx_organization',
            'dependencies_table': 'de10_na_horizonx_dependencies', 
            'type_table': 'de10_na_horizonx_type',
            'modality_table': 'de10_na_horizonx_modality', 
            'size_table': 'de10_na_horizonx_size', 
            'access_table': 'de10_na_horizonx_access', 
            'license_table': 'de10_na_horizonx_license',
            'model_table': 'de10_na_horizonx_model',
            'model_organization_table': 'de10_na_horizonx_model_organization',
            'model_dependencies_table': 'de10_na_horizonx_model_dependencies'
        }

        # Initialise processor
        processor = Processor(file_path, schema, table_names)

        # Execute data fetching, processing, and loading
        processor.fetch_process_load_data()
        
    except Exception as e:
        logger.error(f"An error occurred during execution: {e}")

if __name__ == "__main__":
    main()
