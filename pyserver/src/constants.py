from enum import Enum
from config import append_app_data_path

BINANCE_DATA_COLS = [
    "kline_open_time",
    "open_price",
    "high_price",
    "low_price",
    "close_price",
    "volume",
    "kline_close_time",
    "quote_asset_volume",
    "number_of_trades",
    "taker_buy_base_asset_volume",
    "taker_buy_quote_asset_volume",
    "ignore",
]

LOG_FILE = "logs"
DB_DATASETS = "datasets.db"

STREAMING_DEFAULT_CHUNK_SIZE = 1024

DATASET_UTILS_DB_PATH = "datasets_util.db"


class DomEventChannels(Enum):
    REFETCH_ALL_DATASETS = "refetch_all_datasets"


class AppConstants:
    DB_DATASETS = append_app_data_path(DB_DATASETS)


class NullFillStrategy(Enum):
    NONE = 1
    ZERO = 2
    MEAN = 3
    CLOSEST = 4


class ScalingStrategy(Enum):
    NONE = 1
    MIN_MAX = 2
    STANDARD = 3
