import time
from playwright.sync_api import sync_playwright

def verify_ui():
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        print("Navigating to app...")
        page.goto("http://localhost:3000")

        # Wait for potential hydration
        page.wait_for_timeout(2000)

        # DEBUG: Print all button text content
        buttons = page.locator("button").all()
        print(f"Found {len(buttons)} buttons on page.")
        for i, btn in enumerate(buttons):
            try:
                print(f"Button {i}: {btn.inner_text()} | Visible: {btn.is_visible()}")
            except:
                pass

        # Check for Modal
        if page.is_visible("text=Daily Run"):
            print("Detected 'Daily Run' modal.")
            # Click close button (X) or Accept
            try:
                page.click("button:has(svg.lucide-x)", timeout=2000)
                print("Clicked close button (X).")
            except:
                print("Could not find close button, trying ACCEPT.")
                page.click("text=ACCEPT CHALLENGE")
        else:
            print("No 'Daily Run' modal detected.")

        # Try to find the play button
        # In MainMenu.tsx, it's a button with a Play icon.
        # It's the only button with w-full inside the card, probably.

        print("Attempting to click Play button...")
        try:
            # Locate by the SVG icon class
            page.click("button:has(svg.lucide-play)", timeout=5000)
            print("Clicked Play button.")
        except Exception as e:
            print(f"Failed to click Play button: {e}")
            # Fallback: Click the biggest button?

        # Check if Game Status changed
        # We can look for HUD elements
        try:
            page.wait_for_selector("text=SCORE", state="visible", timeout=5000)
            print("SUCCESS: HUD 'SCORE' is visible. Game started.")

            # Wait for some rendering
            page.wait_for_timeout(2000)
            page.screenshot(path="/home/jules/verification/verify_gameplay_v3.png")
            print("Saved verify_gameplay_v3.png")

        except Exception as e:
            print(f"FAILURE: HUD not visible. Game did not start or HUD missing. Error: {e}")
            page.screenshot(path="/home/jules/verification/failed_start_v3.png")

            # Debug: Print body HTML
            # print(page.content())

        browser.close()

if __name__ == "__main__":
    verify_ui()
