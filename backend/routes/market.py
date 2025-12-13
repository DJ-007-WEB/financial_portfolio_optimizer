from fastapi import APIRouter, HTTPException
from ..services.data_pipeline import load_symbol
from ..services.finance_utils import compute_volatility, compute_mean_return

router = APIRouter(tags=["Market Data"])

@router.get("/market/{symbol}")
def last_price(symbol: str):
    try:
        df = load_symbol(symbol)
        last_row = df.iloc[-1]

        return {
            "symbol": symbol.upper(),
            "last_price": float(last_row["close"]),
            "date": str(last_row["date"])
        }

    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/market/history/{symbol}")
def history(symbol: str):
    try:
        df = load_symbol(symbol)
        return df.to_dict(orient="records")

    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/market/stats/{symbol}")
def stats(symbol: str):
    try:
        df = load_symbol(symbol)

        return {
            "symbol": symbol.upper(),
            "volatility": compute_volatility(df),
            "mean_return": compute_mean_return(df),
        }

    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
