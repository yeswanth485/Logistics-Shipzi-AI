import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")
key: str = (
    os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    or os.environ.get("SUPABASE_ANON_KEY")
    or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
)

# In a real production app with RLS, we'd want to use the service_role key for backend overrides,
# or pass the user's JWT from the request to act on their behalf.
# Since the prompt asked for basic CRUD, we initialize a general client here.
supabase: Client = create_client(url, key)

class CRUD:
    @staticmethod
    def get_by_id(table: str, id: str):
        response = supabase.table(table).select("*").eq("id", id).execute()
        return response.data[0] if response.data else None
        
    @staticmethod
    def get_all(table: str, company_id: str = None, limit: int = 100):
        query = supabase.table(table).select("*")
        if company_id:
            query = query.eq("company_id", company_id)
        response = query.limit(limit).execute()
        return response.data

    @staticmethod
    def create(table: str, data: dict):
        response = supabase.table(table).insert(data).execute()
        return response.data[0] if response.data else None

    @staticmethod
    def update(table: str, id: str, data: dict):
        response = supabase.table(table).update(data).eq("id", id).execute()
        return response.data[0] if response.data else None

    @staticmethod
    def delete(table: str, id: str):
        response = supabase.table(table).delete().eq("id", id).execute()
        return response.data
