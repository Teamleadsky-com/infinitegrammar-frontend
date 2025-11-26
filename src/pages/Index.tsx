// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <>
      {/* Hidden Netlify form so Netlify can detect "waitlist" at build time */}
      <form
        name="waitlist"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        style={{ display: "none" }}
      >
        {/* Netlify will also inject its own hidden form-name,
            but having it here is safe and recommended for JS/AJAX forms */}
        <input type="hidden" name="form-name" value="waitlist" />

        {/* These names MUST match what your popup sends */}
        <input type="email" name="email" />
        <input type="text" name="exercisesCompleted" />

        {/* Honeypot field (must match netlify-honeypot="bot-field") */}
        <p>
          <label>
            Don’t fill this out if you’re human: <input name="bot-field" />
          </label>
        </p>
      </form>

      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Welcome to Your Blank App</h1>
          <p className="text-xl text-muted-foreground">
            Start building your amazing project here!
          </p>
        </div>
      </div>
    </>
  );
};

export default Index;
