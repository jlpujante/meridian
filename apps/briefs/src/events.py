import requests
import os
from datetime import date
from pydantic import BaseModel, field_validator
from typing import Optional
import pandas as pd
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator
from dotenv import load_dotenv
from src.utils import is_debug_mode

load_dotenv()


class Source(BaseModel):
    id: int
    name: str


class Event(BaseModel):
    id: int
    sourceId: int
    url: str
    title: str
    publishDate: datetime  # changed from date to datetime
    content: str
    location: str
    relevance: str
    completeness: str
    summary: str

    @field_validator("publishDate", mode="before")
    @classmethod
    def parse_date(cls, value):
        if value is None:
            return None

        # Handle ISO format with timezone info
        try:
            return datetime.fromisoformat(value)
        except ValueError:
            # For older Python versions or non-standard formats
            # you might need dateutil
            from dateutil import parser

            return parser.parse(value)


def get_events(date: str = None, host: str = None):
    """ Get events endpoint function
    @param : date (ex: "2025-04-01")
    @param : host ("http://localhost:8787")
    """
    url = f"https://meridian-production.alceos.workers.dev/events" if not host else f"{host}/events"
    if date:
        url += f"?date={date}"

    if is_debug_mode():
        print(f"url => {url}")

    response = requests.get(
        url,
        headers={"Authorization": f"Bearer {os.environ.get('MERIDIAN_SECRET_KEY')}"},
    )
    data = response.json()

    sources = [Source(**source) for source in data["sources"]]
    events = [Event(**event) for event in data["events"]]

    return sources, events
