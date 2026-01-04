from playwright.sync_api import sync_playwright
import time
import os

def verify_game():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Start local server if not already running (this script assumes it's running on 5173 or the user will start it)
        # For this environment, we'll try to access the preview URL if we can, but usually we verify locally.
        # Since I can't start a background process easily in this specific python script without it blocking,
        # I will assume 'npm run preview' or 'npm run dev' is running.
        # Actually, I should probably use the static build if possible or just try to hit the port.

        # NOTE: In this environment, I need to start the server first.
        # But let's assume I'll run this script AFTER starting the server in bash.

        try:
            page.goto("http://localhost:4173") # Default vite preview port
            page.wait_for_selector("text=START GAME", timeout=10000)
            print("Main Menu loaded successfully.")

            # Take screenshot of Main Menu
            page.screenshot(path="verify_main_menu.png")
            print("Screenshot 'verify_main_menu.png' saved.")

            # Click Daily Challenge
            page.click("text=Daily")
            time.sleep(1)
            page.screenshot(path="verify_daily_challenge.png")
            print("Screenshot 'verify_daily_challenge.png' saved.")

            # Close modal
            page.click("button >> text=ACCEPT CHALLENGE")
            time.sleep(0.5)

            # Click Start Game
            page.click("text=START GAME")
            time.sleep(2) # Wait for game to load

            # Take in-game screenshot
            page.screenshot(path="verify_gameplay.png")
            print("Screenshot 'verify_gameplay.png' saved.")

        except Exception as e:
            print(f"Error during verification: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_game()
