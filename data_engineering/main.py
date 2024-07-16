import logging
from decouple import config

from classes.data_processor import DataProcessor
from classes.db_connector import DBConnector
from classes.data_loader import DataLoader

# Configure the logging module
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Processor:
    def __init__(self, file_path, schema, table_names):
        self.db_connector = DBConnector()
        self.data_processor = DataProcessor(file_path)
        self.data_loader = DataLoader(self.db_connector.db_engine, schema, table_names)
        self.schema = schema
        self.table_names = table_names

    def fetch_process_load_data(self):
        try:
            # Process data
            df = self.data_processor._load_and_process_data()

            # Upload and configure data
            self.data_loader._upload_data(df)

            logger.info("Cleaned data loaded to PostgreSQL tables successfully.")
        except Exception as e:
            logger.error(f"An error occurred: {e}")

def main():
    """
    Main function to fetch air quality data, process it, and load into PostgreSQL tables.
    """
    try:
        # Load configuration
        file_path = 'Portfolio-Github/HorizonXHackathon/data_engineering/data/assets.csv'

        schema = 'student'
        table_names = {
            'llms_table'       : 'de10_na_horizonx_llms'
        }

        # Initialise processor
        processor = Processor(file_path, schema, table_names)

        # Execute data fetching, processing, and loading
        processor.fetch_process_load_data()
        
    except Exception as e:
        logger.error(f"An error occurred during execution: {e}")


if __name__ == "__main__":
    main()
