<script>
	let fName = "";
	let lName = "";
	let email = "";
	let subject = "";
	let message = "";
	$: fullName = `${fName} ${lName}`;

	const sendEmail = () => {};
</script>

<form
	class="slide"
	id="contact"
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
		gap: 30px;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;

		@media (width <= 600px) {
			grid-template-columns: 1fr;
		}
	}

	label {
		color: var(--text-color);
		font-family: var(--roslindale);
		font-size: var(--heading-paragraph);
	}

	input,
	textarea {
		width: 100%;
		padding: 0.5rem;
		min-height: 60px;
		border-radius: 8px;
		border: 2px solid var(--fg-light-color);
		background-color: var(--bg-color);
		opacity: 0.5;
		margin-top: 30px;

		&:focus {
			outline: none;
			border-color: var(--fg-color);
			opacity: 1;
		}
	}

	button {
		grid-column: 1 / -1;

		justify-self: center;
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
