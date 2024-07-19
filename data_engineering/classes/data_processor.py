import logging
import pandas as pd
import re
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
            self.df_model['score_business_readiness'] = ""
            self.df_model['score_perceived_value'] = ""
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
            self.df_model['organization'] = self.df_model['organization'].str.split(', ')
            df_exploded = self.df_model.explode('organization')
            unique_values = df_exploded['organization'].unique()
            self.df_organization = pd.DataFrame(unique_values, columns=['organization'])
            self.df_organization['organization_id'] = self.df_organization.index + 1

            self.df_model_organization = pd.merge(df_exploded, self.df_organization, on='organization')
            self.df_model_organization = self.df_model_organization[['model_id', 'organization_id']]

            self.df_organization['organization_logo_url'] = ""
            self.df_model = self.df_model.drop('organization', axis=1)

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
            self.df_model = self.df_model.drop('dependencies', axis=1)

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

    @staticmethod
    def extract_and_remove_urls(text):
        if not isinstance(text, str):
            return [], text
        url_pattern = r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
        urls = re.findall(url_pattern, text)
        text_without_urls = re.sub(url_pattern, '', text)
        return urls, text_without_urls

    @staticmethod
    def extract_numbers_and_units(text: str) -> Tuple[Optional[float], Optional[str]]:
        """
        Extracts numbers and units from a given text and converts the numbers to a standard numerical value.

        Args:
            text (str): The input text containing numbers and units.

        Returns:
            Tuple[Optional[float], Optional[str]]: A tuple containing the numerical value and the unit.
        """
        if not isinstance(text, str):
            return None, None

        # Standardize text by replacing full words with single letters for easier processing
        text = text.replace(' trillions', 'T')
        text = text.replace(' trillion', 'T')
        text = text.replace(' billions', 'B')
        text = text.replace(' billion', 'B')
        text = text.replace(' millions', 'M')
        text = text.replace(' million', 'M')
        text = text.replace(' thousands', 'K')
        text = text.replace(' thousand', 'K')
        text = text.replace('k', 'K')

        number_pattern = r'([\d\.]+(?:[BMKT]?)?)'
        unit_pattern = r'(parameters \(dense\)|parameters \(sparse\)|parameters \(dense model\)|parameters|documents|captions paired with 0.5M audio clips|tokens|text-video pairs at 8FPS|hours|text queries|prompts|instructions|judge samples|images|videos|tasks|hours audio|hours audio with pseudolabels|\(image, text\) pairs|words|annotated video clip pairs|vision-language datasets|video clip pairs|video clips|image-text pairs|ratings|songs|captions|comparisons|response pairs|observations|samples|dialogues|examples|human-annotated prompt-completion pairs|instruction-following demonstrations|labels of quantum and biological nature|GB|TB|MB|KB)'

        number_match = re.search(number_pattern, text)
        unit_match = re.search(unit_pattern, text)

        if number_match:
            number = number_match.group(1)
            # Convert number to actual numerical value
            if 'T' in number:
                numeric_value = float(number.replace('T', '')) * 1e12
            elif 'B' in number:
                numeric_value = float(number.replace('B', '')) * 1e9
            elif 'M' in number:
                numeric_value = float(number.replace('M', '')) * 1e6
            elif 'K' in number:
                numeric_value = float(number.replace('K', '')) * 1e3
            else:
                try:
                    numeric_value = float(number)
                except ValueError:
                    numeric_value = None
        else:
            numeric_value = None

        unit = unit_match.group(0) if unit_match else None

        return numeric_value, unit

    def _load_and_process_data(self) -> Tuple[pd.DataFrame, ...]:
        """Load and preprocess the data and return the processed DataFrames."""
        try:
            self.__load_data()
            self.__preprocess_data()
            self.__process_organizations()
            self.__process_dependencies()

            for column in self.foreign_key_dfs.keys():
                self.__replace_with_foreign_key(column)
                
                if self.foreign_key_dfs[column] is not None:
                    self.foreign_key_dfs[column]['extracted_urls'], self.foreign_key_dfs[column][column] = zip(*self.foreign_key_dfs[column][column].apply(self.extract_and_remove_urls))
                    
                    if column == 'size':
                        self.foreign_key_dfs[column]['numeric_size'], self.foreign_key_dfs[column]['unit'] = zip(*self.foreign_key_dfs[column]['size'].apply(self.extract_numbers_and_units))

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
