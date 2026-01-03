import time
from playwright.sync_api import sync_playwright

def verify_ui():
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        # Create a new context with a specific viewport size to match the game's typical aspect ratio
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        print("Navigating to app...")
        # Navigate to the app (assuming it's running on port 3000)
        page.goto("http://localhost:3000")

        # Wait for the main menu to load
        try:
            # Look for "SEASON 1: SPARKLE" which is in the new MainMenu
            page.wait_for_selector("text=SEASON 1: SPARKLE", timeout=10000)
            print("Main menu loaded.")
        except Exception as e:
            print("Main menu did not load as expected.")
            print(e)
            browser.close()
            return

        # Take a screenshot of the main menu
        page.screenshot(path="/home/jules/verification/main_menu_final.png")
        print("Screenshot 'main_menu_final.png' saved.")

        # Check for any obstructing modals like "Combo King" or Daily Challenge
        # The error log showed: <h3 class="text-2xl font-black text-black mb-1 uppercase">Combo King</h3>
        # This seems to be the Daily Challenge title "Daily Run" or something similar if I misread the log?
        # Wait, the log said "Combo King".
        # Let's handle generic modals closing.

        # Try to close any modal if present
        # Look for buttons with text "ACCEPT CHALLENGE" or "X" or similar
        try:
             # Check for "Combo King" specifically as seen in logs
             if page.is_visible("text=Combo King"):
                 print("Found 'Combo King' modal. Attempting to close...")
                 # Try to find a close button or action button inside the modal container
                 # The modal container has class fixed inset-0 z-[200]

                 # It might be the Daily Challenge UI if the title is dynamic, but the code says "Daily Run".
                 # Wait, looking at DailyChallengeUI.tsx: <h3 ...>{challenge.title}</h3>
                 # {challenge.title} comes from dailyChallenge.getDailyChallenge().
                 # If the challenge title is "Combo King", then that's it!

                 # Button "ACCEPT CHALLENGE" closes it.
                 page.click("text=ACCEPT CHALLENGE")
                 print("Closed 'Combo King' modal.")
                 time.sleep(1)
        except Exception as e:
            print(f"No blocking modal found or failed to close: {e}")

        # Now try to start the game
        print("Starting game...")
        try:
            # The play button is the one with the Play icon.
            # It has class "w-full py-6 bg-white/40 ..."
            # We can find it by the Play icon inside it or just the button structure.
            # Or use the "READY TO RUN" text's parent sibling?
            # Let's use a CSS selector for the big play button
            # It contains a Play icon (svg)

            # Use specific selector based on the refactored code
            page.click("button:has(svg.lucide-play)")

            # Wait for HUD to appear
            # HUD has "SCORE", "LIVES" etc.
            page.wait_for_selector("text=SCORE", timeout=10000)
            print("Game started, HUD visible.")

            # Wait a bit for the game to actually render frames
            time.sleep(2)

            # Take a screenshot of gameplay/HUD
            page.screenshot(path="/home/jules/verification/gameplay_hud_final.png")
            print("Screenshot 'gameplay_hud_final.png' saved.")

        except Exception as e:
            print(f"Failed to start game or verify HUD: {e}")
            # Take a screenshot to see what's wrong
            page.screenshot(path="/home/jules/verification/failed_state.png")

        browser.close()

if __name__ == "__main__":
    verify_ui()
