import React, { FC } from "react";

type Props = {
  transferTokens?: (to: any, amount: any) => void;
  tokenSymbol?: string;
};

export const Transfer: FC<Props> = ({ transferTokens, tokenSymbol }) => {
  return (
    <div>
      <h4>Transfer</h4>
      <form
        onSubmit={(event: any) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const to: any = formData.get("to");
          const amount: any = formData.get("amount");

          if (to && amount) {
            transferTokens && transferTokens(to, amount);
          }
        }}
      >
        <div className="form-group">
          <label>Amount of {tokenSymbol}</label>
          <input
            className="form-control"
            type="number"
            step="1"
            name="amount"
            placeholder="1"
            required
          />
        </div>
        <div className="form-group">
          <label>Recipient address</label>
          <input className="form-control" type="text" name="to" required />
        </div>
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Transfer" />
        </div>
      </form>
    </div>
  );
};
