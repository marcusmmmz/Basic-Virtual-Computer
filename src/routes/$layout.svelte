<nav>
	<a href="/">Play</a>
	<a href="/editor">Editor</a>
	<a href="/guide">Guide</a>
</nav>
<slot />

<style>
	:root {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
			Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
		font-size: 150%;
		text-align: center;
	}
	:global(*) {
		color: white;
	}
	:global(body, button, input) {
		background: black;
	}
	:global(html, body) {
		margin: 0;
		padding: 0;
	}
	:global(#svelte) {
		display: flex;
		flex-direction: column;
		width: 100vw;
		height: 100vh;
	}
</style>
