const generateForgotPasswordEmail = (email: string, randomNumber: number) => {
  return {
    from: 'grobartig.inc@gmail.com',
    to: email,
    subject: 'Email confirmation',
    html: `<main
      style="
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
          'Lucida Sans', Arial, sans-serif;
      "
    >
      <div
        style="
          background-color: blue;
          color: white;
          padding: 10px;
          margin-bottom: 40px;
        "
      >
        <h1 style="text-align: center">Houser</h1>
      </div>

      <div style="text-align: center">
        <p>
          This is a confirmation email to reset your password, If you didn't
          start this process, please ignore this email.
        </p>
        <p>If this was you, use the code below to reset your password</p>

        <div style="text-align: center; width: 200px; margin: 50px auto;">
    
            <span
              style="
                width: 60%;
                background-color: blue;
                padding: 10px 30px;
                border-radius: 8px;
                color: white;
                text-decoration: none;
                color: white;
              "
            >
             ${randomNumber}
            </span>
          </div>
        </div>
      </div>
    </main>
`,
  };
};

export default generateForgotPasswordEmail;
