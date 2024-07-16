import logging
import pandas as pd
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from typing import Any, List, Dict, Tuple

# Configure the logging module
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataProcessor:
    def __init__(self, db_engine, file_path: str) -> None:
        """
        Initialise the DataProcessor with the path to the CSV file.

        Args:
            file_path (str): Path to the CSV file.
        """
        self.db_engine = db_engine
        self.file_path = file_path
        self.df: pd.DataFrame | None = None

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

    def process_llm_data(self, results: List[Dict[str, Any]], schema: str, table_names: Dict[str, str]) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
        """
        Process large langauge model data into DataFrames.

        Args:
            results (List[Dict[str, Any]]): The raw LLM data.

        Returns:
            Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]: DataFrames for countries, cities, locations, and measurements.
        """
        existing_organisation = self.__fetch_table_as_dataframe(schema, table_names['organisation_table'])
        existing_type = self.__fetch_table_as_dataframe(schema, table_names['type_table'])
        existing_modality = self.__fetch_table_as_dataframe(schema, table_names['modality_table'])
        existing_size = self.__fetch_table_as_dataframe(schema, table_names['size_table'])
        existing_dependencies = self.__fetch_table_as_dataframe(schema, table_names['dependencies_table'])
        existing_access = self.__fetch_table_as_dataframe(schema, table_names['access_table'])
        existing_license = self.__fetch_table_as_dataframe(schema, table_names['license_table'])
        existing_llms = self.__fetch_table_as_dataframe(schema, table_names['llms_table'])

        organisation, type, modality, size, dependencies, access, license, llms = [], [], [], [], [], [], [], []
        organisation_id_map, type_id_map , modality_id_map, size_id_map, dependencies_id_map, access_id_map, license_id_map, llms_id_map = {}, {}, {}, {}, {}, {}, {}, {}
        
        def populate_id_map(df, id_map, id_col, key_cols, counter):
            for _, row in df.iterrows():
                key = tuple(row[col] for col in key_cols) if isinstance(key_cols, tuple) else row[key_cols]
                id_map[key] = row[id_col]
                counter = max(counter, row[id_col] + 1)
            return counter

        organisation_id_counter = populate_id_map(existing_organisation, organisation_id_map, 'organisation_id', 'organisation', 1)
        type_id_counter = populate_id_map(existing_type, type_id_map, 'type_id', 'type', 1)
        modality_id_counter = populate_id_map(existing_modality, modality_id_map, 'modality_id', 'modality', 1)
        size_id_counter = populate_id_map(existing_size, size_id_map, 'size_id', 'size', 1)
        dependencies_id_counter = populate_id_map(existing_dependencies, dependencies_id_map, 'dependencies_id', 'dependencies', 1)
        access_id_counter = populate_id_map(existing_dependencies, access_id_map, 'access_id', 'access', 1)
        license_id_counter = populate_id_map(existing_license, license_id_map, 'license_id', 'license_name', 1)
        llm_id_counter = populate_id_map(existing_llms, llms_id_map, 'llms_id', 'name', 1)

        for result in results:
            llm = result['llm']
            location_name, city, country, coordinates = result['location'], result['city'], result['country'], result['coordinates']

            # Country processing
            if llm not in llm_id_map:
                llm_id_map[llms] = llm_id_counter
                llms.append({'llms_id': llm_id_counter, 'name': llm})
                llm_id_counter += 1

            """
            # Country processing
            if country not in country_id_map:
                country_id_map[country] = country_id_counter
                countries.append({'country_id': country_id_counter, 'country_name': country})
                country_id_counter += 1

            country_id = country_id_map[country]
            city_key = (city, country_id)

            # City processing
            if city_key not in city_id_map:
                city_id_map[city_key] = city_id_counter
                cities.append({'city_id': city_id_counter, 'city_name': city, 'country_id': country_id})
                city_id_counter += 1

            city_id = city_id_map[city_key]
            location_key = (location_name, city_id, coordinates['latitude'], coordinates['longitude'])

            # Location processing
            if location_key not in location_id_map:
                location_id_map[location_key] = location_id_counter
                locations.append({
                    'location_id': location_id_counter,
                    'location_name': location_name,
                    'city_id': city_id,
                    'latitude': coordinates['latitude'],
                    'longitude': coordinates['longitude']
                })
                location_id_counter += 1

            location_id = location_id_map[location_key]

            # Append measurements data
            measurements.extend([{
                'location_id': location_id,
                'parameter': m['parameter'],
                'value': m['value'],
                'last_updated': m['lastUpdated'],
                'unit': m['unit']
            } for m in result['measurements']])
            """
        
        llms_df = pd.DataFrame(llms)
        #countries_df = pd.DataFrame(countries)
        #cities_df = pd.DataFrame(cities)
        #locations_df = pd.DataFrame(locations)
        #measurements_df = pd.DataFrame(measurements)
        
        # Ensure all timestamps are in the same format
        llms_df['created_date'] = llms_df['created_date'].apply(pd.to_datetime, format='ISO8601', errors='coerce').dt.tz_localize(None)

        if not existing_measurements.empty:
            measurements_df = measurements_df.merge(existing_measurements, on=['location_id', 'parameter', 'value', 'last_updated', 'unit'], how='outer', indicator=True)
            measurements_df = measurements_df[measurements_df['_merge'] == 'left_only'].drop(columns=['_merge'])
            measurements_df = measurements_df.drop_duplicates(subset=['location_id', 'parameter', 'value', 'last_updated', 'unit']).reset_index(drop=True)
        else:
            measurements_df = measurements_df.drop_duplicates(subset=['location_id', 'parameter', 'value', 'last_updated', 'unit']).reset_index(drop=True)

        return df
