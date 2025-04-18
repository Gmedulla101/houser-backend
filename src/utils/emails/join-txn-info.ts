const generateCreateTxnEmail = (email: string, txnId: string) => {
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
          background-color: oklch(62.3% 0.214 259.815);
          color: white;
          padding: 10px;
          margin-bottom: 40px;
        "
      >
        <h1 style="text-align: center">Payway</h1>
      </div>

      <div style="text-align: center">
        <p>
        You have been invited to join a transaction on Payway . 
        </p>
       

        <div style="text-align: center; width: 200px; margin: 50px auto;">
    
            <a
              href="http://localhost:5173/transaction/${txnId}"
              style="
                width: 60%;
                background-color: black;
                padding: 10px 30px;
                border-radius: 8px;
                color: white;
                text-decoration: none;
                color: white;
              "
            >
             Join the transaction
            </a>
          </div>
        </div>
      </div>
    </main>
`,
  };
};

export default generateCreateTxnEmail;
