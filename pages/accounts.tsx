import { db } from "../lib/db";
import { Button } from "react-bootstrap";

const Accounts = () => {
  const addFriend = async() => {
    const id = await db.friends.add({
      name: 'plop',
      age: 4
    });
    console.log(id);
  }

  return (
    <div>
      Accounts
      <Button onClick={addFriend}>Plop</Button>
      </div>
  );
}

export default Accounts;