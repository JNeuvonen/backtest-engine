import sys
from tests.t_conf import SERVER_SOURCE_DIR

sys.path.append(SERVER_SOURCE_DIR)

from server import Routers
from route_datasets import RoutePaths as DatasetRoutePaths
from route_model import RoutePaths as ModelRoutePaths


class FixturePaths:
    BINANCE = "fixtures/binance/{}"
    BINANCE_DOWNLOADED = "fixtures/binance/downloaded/{}"


class Constants:
    TESTS_FOLDER = "/tests"
    BIG_TEST_FILE = "big_testfile.csv"
    EXAMPLE_MODEL_NAME = "Example model"


class DatasetMetadata:
    def __init__(
        self,
        path: str,
        dataset_name: str,
        timeseries_col: str,
        pair_name: str | None = None,
    ) -> None:
        self.path = path
        self.name = dataset_name
        self.timeseries_col = timeseries_col
        self.pair_name = pair_name


class BinanceCols:
    KLINE_OPEN_TIME = "kline_open_time"
    OPEN_PRICE = "open_price"
    HIGH_PRICE = "high_price"
    LOW_PRICE = "low_price"
    CLOSE_PRICE = "close_price"
    VOLUME = "volume"
    KLINE_CLOSE_TIME = "kline_close_time"
    QUOTE_ASSET_VOLUME = "quote_asset_volume"
    NUMBER_OF_TRADES = "number_of_trades"
    TAKER_BUY_BASE_ASSET_VOLUME = "taker_buy_base_asset_volume"
    TAKER_BUY_QUOTE_ASSET_VOLUME = "taker_buy_quote_asset_volume"


class BinanceData:
    BTCUSDT_1H_2023_06 = DatasetMetadata(
        FixturePaths.BINANCE.format("BTCUSDT-1h-2023-06.csv"),
        "btcusdt_1h",
        BinanceCols.KLINE_OPEN_TIME,
    )
    DOGEUSDT_1H_2023_06 = DatasetMetadata(
        FixturePaths.BINANCE.format("DOGEUSDT-1h-2023-06.csv"),
        "dogeusdt_1h",
        BinanceCols.KLINE_OPEN_TIME,
    )
    ETHBTC_1H_2023_06 = DatasetMetadata(
        FixturePaths.BINANCE.format("ETHBTC-1h-2023-06.csv"),
        "ethbtc_1h",
        BinanceCols.KLINE_OPEN_TIME,
    )
    ETHUSDT_1H_2023_06 = DatasetMetadata(
        FixturePaths.BINANCE.format("ETHUSDT-1h-2023-06.csv"),
        "ethusdt_1h",
        BinanceCols.KLINE_OPEN_TIME,
    )

    BTCUSDT_1MO = DatasetMetadata(
        FixturePaths.BINANCE_DOWNLOADED.format("BTCUSDT-1mo.csv"),
        "btcusdt_1mo",
        BinanceCols.KLINE_OPEN_TIME,
        "BTCUSDT",
    )
    SUSHIUSDT_1MO = DatasetMetadata(
        FixturePaths.BINANCE_DOWNLOADED.format("SUSHIUSDT-1mo.csv"),
        "sushiusdt_1mo",
        BinanceCols.KLINE_OPEN_TIME,
        "SUSHIUSDT",
    )
    AAVEUSDT_1MO = DatasetMetadata(
        FixturePaths.BINANCE_DOWNLOADED.format("AAVEUSDT-1mo.csv"),
        "aaveusdt_1mo",
        BinanceCols.KLINE_OPEN_TIME,
        "AAVEUSDT",
    )


class EnvTestSpeed:
    FAST = "FAST"
    SLOW = "SLOW"


class Size:
    KB_BYTES = 1024
    MB_BYTES = 1024 * 1024
    GB_BYTES = 1024 * 1024 * 1024


class URL:
    BASE_URL = "http://localhost:8000"

    @classmethod
    def _datasets_route(cls):
        return cls.BASE_URL + Routers.DATASET

    @classmethod
    def _models_route(cls):
        return cls.BASE_URL + Routers.MODEL

    @classmethod
    def get_model_by_name(cls, model_name):
        return cls._models_route() + ModelRoutePaths.FETCH_MODEL.format(
            model_name=model_name
        )

    @classmethod
    def t_get_tables(cls):
        return cls._datasets_route() + DatasetRoutePaths.ALL_TABLES

    @classmethod
    def t_get_rename_column(cls, dataset_name: str):
        return cls._datasets_route() + DatasetRoutePaths.RENAME_COLUMN.format(
            dataset_name=dataset_name
        )

    @classmethod
    def get_column_detailed_info(cls, dataset_name: str, column_name: str):
        return cls._datasets_route() + DatasetRoutePaths.GET_DATASET_COL_INFO.format(
            dataset_name=dataset_name, column_name=column_name
        )

    @classmethod
    def update_timeseries_col(cls, dataset_name: str):
        return cls._datasets_route() + DatasetRoutePaths.UPDATE_TIMESERIES_COL.format(
            dataset_name=dataset_name
        )

    @classmethod
    def t_get_all_columns(cls):
        return cls._datasets_route() + DatasetRoutePaths.ROOT

    @classmethod
    def t_get_dataset_by_name(cls, dataset_name: str):
        return cls._datasets_route() + DatasetRoutePaths.GET_DATASET_BY_NAME.format(
            dataset_name=dataset_name
        )

    @classmethod
    def exec_python_on_col(cls, dataset_name, column_name):
        return cls._datasets_route() + DatasetRoutePaths.EXEC_PYTHON_ON_COL.format(
            dataset_name=dataset_name, column_name=column_name
        )

    @classmethod
    def exec_python_on_dataset(cls, dataset_name):
        return cls._datasets_route() + DatasetRoutePaths.EXEC_PYTHON_ON_DATASET.format(
            dataset_name=dataset_name
        )

    @classmethod
    def create_model(cls, dataset_name):
        return cls._datasets_route() + DatasetRoutePaths.CREATE_MODEL.format(
            dataset_name=dataset_name
        )

    @classmethod
    def create_train_job(cls, model_name):
        return cls._models_route() + ModelRoutePaths.CREATE_TRAIN_JOB.format(
            model_name=model_name
        )

    @classmethod
    def add_columns_to_dataset(cls, dataset_name: str, null_fill_strategy: str):
        return (
            cls._datasets_route()
            + DatasetRoutePaths.ADD_COLUMNS.format(dataset_name=dataset_name)
            + f"?is_test_mode=True&null_fill_strategy={null_fill_strategy}"
        )

    @classmethod
    def t_update_dataset_name(cls, dataset_name: str):
        return cls._datasets_route() + DatasetRoutePaths.UPDATE_DATASET_NAME.format(
            dataset_name=dataset_name
        )

    @classmethod
    def t_get_upload_dataset_url(cls, table_name: str, timeseries_col: str):
        return (
            cls._datasets_route()
            + DatasetRoutePaths.UPLOAD_TIMESERIES_DATA
            + f"?dataset_name={table_name}&timeseries_col={timeseries_col}"
        )

    @classmethod
    def get_dataset_models(cls, dataset_name: str):
        return cls._datasets_route() + DatasetRoutePaths.FETCH_MODELS.format(
            dataset_name=dataset_name
        )
