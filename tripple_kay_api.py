# tripple_kay_api.py
"""
API endpoints for Tripple Kay Cutts Spa
This file contains Python functions for all required API calls.
"""

import requests

BASE_URL = "https://mysql-tripplekay.alwaysdata.net/tripple-kay-api"

# --- Auth APIs ---
def signup(name, email, phone, password):
    url = f"{BASE_URL}/auth/signup.php"
    payload = {
        "name": name,
        "email": email,
        "phone": phone,
        "password": password
    }
    response = requests.post(url, json=payload)
    return response.json()

def login(email, password):
    url = f"{BASE_URL}/auth/login.php"
    payload = {
        "email": email,
        "password": password
    }
    response = requests.post(url, json=payload)
    return response.json()

def verify_token(token):
    url = f"{BASE_URL}/auth/verify.php"
    payload = {"token": token}
    response = requests.post(url, json=payload)
    return response.json()

# --- Bookings APIs ---
def create_booking(data):
    url = f"{BASE_URL}/bookings/create.php"
    response = requests.post(url, json=data)
    return response.json()

def list_bookings():
    url = f"{BASE_URL}/bookings/list.php"
    response = requests.get(url)
    return response.json()

def get_booking(order_id):
    url = f"{BASE_URL}/bookings/get.php?order_id={order_id}"
    response = requests.get(url)
    return response.json()

def mark_booking_paid(order_id, updates):
    url = f"{BASE_URL}/bookings/mark_paid.php"
    payload = {"order_id": order_id, **updates}
    response = requests.post(url, json=payload)
    return response.json()

# --- Payment APIs ---
def mpesa_initiate(phone, amount, order_id, email):
    url = f"{BASE_URL}/mpesa/initiate.php"
    payload = {
        "phone": phone,
        "amount": amount,
        "orderId": order_id,
        "email": email
    }
    response = requests.post(url, json=payload)
    return response.json()

def mpesa_query(checkout_request_id):
    url = f"{BASE_URL}/mpesa/query.php"
    payload = {"checkoutRequestId": checkout_request_id}
    response = requests.post(url, json=payload)
    return response.json()

# --- KAI Chatbot API ---
def kai_chat(message, history=None):
    url = f"{BASE_URL}/kai-chat.php"
    payload = {"message": message, "history": history or []}
    response = requests.post(url, json=payload)
    return response.json()

# --- Health Check ---
def health_check():
    url = f"{BASE_URL}/health.php"
    response = requests.get(url)
    return response.json()
