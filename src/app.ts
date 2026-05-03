/**
 * app.ts – Miro app entry point.
 *
 * This file is loaded as a module inside the app panel HTML page.  It
 * registers the toolbar icon so that clicking the icon in the Miro sidebar
 * opens the panel (index.html).
 *
 * The Miro Web SDK is available as the global `miro` object injected by the
 * `<script src="https://miro.com/app/static/sdk/v2/miro.js">` tag in
 * index.html.
 */

/**
 * Initialises the Miro app.
 *
 * Called once the SDK script has loaded.  Registers a toolbar icon so that
 * users can open the Decision Canvas panel from any board.
 */
async function initApp(): Promise<void> {
  await miro.board.ui.on("icon:click", async () => {
    await miro.board.ui.openPanel({
      url: "/index.html",
    });
  });
}

initApp().catch(console.error);
