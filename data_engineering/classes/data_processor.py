import logging
import pandas as pd
from typing import Optional

# Configure the logging module
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataProcessor:
    def __init__(self, file_path: str):
        """
        Initialise the DataProcessor with the path to the CSV file.

        Args:
            file_path (str): Path to the CSV file.
        """
        self.file_path = file_path
        self.df: Optional[pd.DataFrame] = None
        logger.info(f"DataProcessor initialised with file path: {self.file_path}")

    def __load_data(self) -> None:
        """Load data from the CSV file into a DataFrame."""
        try:
            self.df = pd.read_csv(self.file_path)
            logger.info(f"Data loaded successfully from {self.file_path}")
        except FileNotFoundError as e:
            logger.error(f"Error: The file at {self.file_path} was not found.")
            raise e
        except pd.errors.ParserError as e:
            logger.error(f"Error: Failed to parse the CSV file at {self.file_path}.")
            raise e
        except Exception as e:
            logger.error(f"Error: An unexpected error occurred while loading the file at {self.file_path}.")
            raise e

    def __preprocess_data(self) -> None:
        """Preprocess the DataFrame."""
        if self.df is None:
            logger.error("Error: DataFrame is not loaded. Please load the data first.")
            raise ValueError("DataFrame is not loaded. Please load the data first.")

        try:
            self.df['created_date'] = pd.to_datetime(self.df['created_date'], format='mixed', errors='coerce')
            self.df['llms_id'] = range(1, len(self.df) + 1)
            logger.info("Data preprocessing completed successfully.")
        except KeyError as e:
            logger.error("Error: Missing 'created_date' column in the data.")
            raise e
        except Exception as e:
            logger.error("Error: An unexpected error occurred during preprocessing.")
            raise e

    def _load_and_process_data(self) -> pd.DataFrame:
        """Load and preprocess the data and return the DataFrame."""
        try:
            self.__load_data()
            self.__preprocess_data()
            logging.info("Data loading and processing completed successfully.")
            return self.df
        except Exception as e:
            logging.error("Error: Data processing failed.")
            raise e