// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <>
      {/* Hidden Netlify form stub so Netlify can detect the form at build time */}
      <form
        name="waitlist"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        hidden
      >
        {/* Netlify needs this hidden form-name field */}
        <input type="hidden" name="form-name" value="waitlist" />

        {/* Fields your real popup form will also send */}
        <input type="email" name="email" />
        <input type="text" name="exercisesCompleted" />

        {/* Honeypot field (must match netlify-honeypot value) */}
        <input type="text" name="bot-field" />
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
