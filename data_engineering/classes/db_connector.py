import os
import logging
from dotenv import load_dotenv, find_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine, URL

# Configure the logging module
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv(find_dotenv())

class DBConnector:
    """
    A class for connecting to a database using SQLAlchemy.
    """

    def __init__(self) -> None:
        """
        Initialises a DatabaseConnector object.
        
        Attributes:
        - db_url (sqlalchemy.engine.URL): SQLAlchemy URL object for database connection.
        - db_engine (sqlalchemy.engine.Engine): SQLAlchemy engine for database operations.
        """
        try:
            self.db_url = self._build_db_url()
            self.db_engine = create_engine(self.db_url)
        except Exception as error:
            raise RuntimeError(f"Error during initialisation: {error}")

    @staticmethod
    def _build_db_url() -> URL:
        """
        Builds a SQLAlchemy URL object from environment variables.

        Returns:
            URL: A SQLAlchemy URL object.
        Raises:
            ValueError: If there is an error creating the database URL.
        """
        try:
            db_driver = os.getenv('DRIVER')
            db_user = os.getenv('DBUSER')
            db_password = os.getenv('PASSWORD')
            db_host = os.getenv('HOST')
            db_port = os.getenv('PORT')
            db_database = os.getenv('DATABASE')

            if not all([db_driver, db_user, db_password, db_host, db_port, db_database]):
                raise ValueError("Missing required environment variables")

            # Create a SQLAlchemy URL object
            return URL.create(
                drivername=db_driver,
                username=db_user,
                password=db_password,
                host=db_host,
                port=db_port,
                database=db_database
            )
        except ValueError as error:
            logger.error(f"Error creating database URL: {error}")
            raise

    def get_engine(self) -> Engine:
        """
        Returns the SQLAlchemy engine object.

        Returns:
            Engine: SQLAlchemy engine object.
        """
        return self.db_engine