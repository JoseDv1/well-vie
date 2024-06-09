<script>
	import { onMount } from "svelte";

	let fName = "";
	let lName = "";
	let email = "";
	let subject = "";
	let message = "";
	$: fullName = `${fName} ${lName}`;

	const sendEmail = () => {};
</script>

<form
	on:submit|preventDefault={() => {
		sendEmail();
	}}
>
	<label for="fName"
		>First Name:
		<input type="text" id="fName" bind:value={fName} required />
	</label>

	<label for="lName"
		>Last Name:
		<input type="text" id="lName" bind:value={lName} required />
	</label>

	<label for="email"
		>Email:
		<input
			type="email"
			id="email"
			bind:value={email}
			required
			autocomplete="email"
		/>
	</label>

	<label for="subject"
		>Subject:
		<input type="text" id="subject" bind:value={subject} required />
	</label>

	<label for="message"
		>Message:
		<textarea id="message" bind:value={message} required></textarea>
	</label>

	<button type="submit">Submit</button>
</form>

<style>
	form {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		max-width: 600px;
		margin: 0 auto;
		padding: 1rem;

		@media (width <= 600px) {
			grid-template-columns: 1fr;
		}
	}

	label {
		font-weight: bold;
	}

	input,
	textarea {
		width: 100%;
		padding: 0.5rem;
		border-radius: 8px;
		border: 1px solid var(--fg-light-color);
		opacity: 0.5;

		&:focus {
			outline: none;
			border-color: var(--fg-color);
			opacity: 1;
		}
	}

	button {
		grid-column: 1 / -1;
		padding: 0.5rem;
	}

	label[for="message"] {
		grid-column: 1 / -1;

		& textarea {
			min-height: 200px;
			min-width: 100%;
			resize: vertical;
		}
	}
</style>
