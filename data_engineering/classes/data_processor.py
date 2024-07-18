import logging
import pandas as pd
from typing import Optional, Tuple

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
        self.df_organization: Optional[pd.DataFrame] = None
        self.df_dependencies: Optional[pd.DataFrame] = None
        self.foreign_key_dfs = {
            'type': None,
            'modality': None,
            'size': None,
            'access': None,
            'license': None
        }
        self.df_model: Optional[pd.DataFrame] = None
        self.df_model_organization: Optional[pd.DataFrame] = None
        self.df_model_dependencies: Optional[pd.DataFrame] = None
        logger.info(f"DataProcessor initialised with file path: {self.file_path}")

    def __load_data(self) -> None:
        """Load data from the CSV file into a DataFrame."""
        try:
            self.df_model = pd.read_csv(self.file_path)
            logger.info(f"Data loaded successfully from {self.file_path}")
        except (FileNotFoundError, pd.errors.ParserError) as e:
            logger.error(f"Error loading file: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error occurred: {e}")
            raise

    def __preprocess_data(self) -> None:
        """Preprocess the DataFrame."""
        if self.df_model is None:
            logger.error("DataFrame is not loaded. Please load the data first.")
            raise ValueError("DataFrame is not loaded. Please load the data first.")
        try:
            self.df_model['created_date'] = pd.to_datetime(self.df_model['created_date'], errors='coerce')
            self.df_model['model_id'] = range(1, len(self.df_model) + 1)
            logger.info("Data preprocessing completed successfully.")
        except KeyError as e:
            logger.error("Missing 'created_date' column in the data.")
            raise
        except Exception as e:
            logger.error(f"Unexpected error during preprocessing: {e}")
            raise

    def __process_organizations(self) -> None:
        """Process organization data in the DataFrame."""
        if self.df_model is None:
            logger.error("DataFrame is not loaded. Please load the data first.")
            raise ValueError("DataFrame is not loaded. Please load the data first.")
        try:
            self.df_model['organization'] = self.df_model['organization'].str.split(',')
            df_exploded = self.df_model.explode('organization')
            unique_values = df_exploded['organization'].unique()
            self.df_organization = pd.DataFrame(unique_values, columns=['organization'])
            self.df_organization['organization_id'] = self.df_organization.index + 1

            self.df_model_organization = pd.merge(df_exploded, self.df_organization, on='organization')
            self.df_model_organization = self.df_model_organization[['model_id', 'organization_id']]

            self.df_organization['organization_logo_url'] = ""

            logger.info("Organization data processing completed successfully.")
        except KeyError as e:
            logger.error("Missing 'organization' column in the data.")
            raise
        except Exception as e:
            logger.error(f"Unexpected error during organization processing: {e}")
            raise

    def __process_dependencies(self) -> None:
        """Process dependencies data in the DataFrame."""
        if self.df_model is None:
            logger.error("DataFrame is not loaded. Please load the data first.")
            raise ValueError("DataFrame is not loaded. Please load the data first.")
        try:
            self.df_model['dependencies'] = self.df_model['dependencies'].str.replace(r"[\[\]']", "", regex=True)
            self.df_model['dependencies'] = self.df_model['dependencies'].str.split(', ')
            df_exploded = self.df_model.explode('dependencies')
            unique_values = df_exploded['dependencies'].dropna().unique()
            self.df_dependencies = pd.DataFrame(unique_values, columns=['dependencies'])
            self.df_dependencies['dependencies_id'] = self.df_dependencies.index + 1
            
            self.df_model_dependencies = pd.merge(df_exploded, self.df_dependencies, on='dependencies')
            self.df_model_dependencies = self.df_model_dependencies[['model_id', 'dependencies_id']]
            
            logger.info("Dependencies data processing completed successfully.")
        except KeyError as e:
            logger.error(f"Missing column in the data: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error during dependencies processing: {e}")
            raise

    def __replace_with_foreign_key(self, column_name: str) -> None:
        """Replace a specified column with a foreign key in the DataFrame."""
        if self.df_model is None:
            logger.error("DataFrame is not loaded. Please load the data first.")
            raise ValueError("DataFrame is not loaded. Please load the data first.")
        try:
            unique_values = self.df_model[column_name].unique()
            df_foreign_key = pd.DataFrame(unique_values, columns=[column_name])
            df_foreign_key[f'{column_name}_id'] = df_foreign_key.index + 1

            self.df_model = pd.merge(self.df_model, df_foreign_key, on=column_name, how='left')
            self.df_model.drop(columns=[column_name], inplace=True)
            self.df_model.rename(columns={column_name: f'{column_name}_id'}, inplace=True)

            self.foreign_key_dfs[column_name] = df_foreign_key

            logger.info(f"{column_name} column replacement with foreign key completed successfully.")
        except KeyError as e:
            logger.error(f"Missing '{column_name}' column in the data.")
            raise
        except Exception as e:
            logger.error(f"Unexpected error during {column_name} column replacement: {e}")
            raise

    def _load_and_process_data(self) -> Tuple[pd.DataFrame, ...]:
        """Load and preprocess the data and return the processed DataFrames."""
        try:
            self.__load_data()
            self.__preprocess_data()
            self.__process_organizations()
            self.__process_dependencies()

            for column in self.foreign_key_dfs.keys():
                self.__replace_with_foreign_key(column)

            logger.info("Data loading and processing completed successfully.")
            return (
                self.df_organization,
                self.df_dependencies,
                self.foreign_key_dfs['type'],
                self.foreign_key_dfs['modality'],
                self.foreign_key_dfs['size'],
                self.foreign_key_dfs['access'],
                self.foreign_key_dfs['license'],
                self.df_model,
                self.df_model_organization,
                self.df_model_dependencies
            )
        except Exception as e:
            logger.error(f"Data processing failed: {e}")
            raise
