import React, { useState, useContext } from "react";
import { Segment, Table, Button, Icon } from "semantic-ui-react";
import { ContactContext } from "../context/contact-context";

export default function ContactTable() {
  // Subscribe to `contacts` state and access dispatch function
  const [state, dispatch] = useContext(ContactContext);
  // Declare a local state to be used internally by this component
  const [selectedId, setSelectedId] = useState();

  const delContact = id => {
    dispatch({
      type: "DEL_CONTACT",
      payload: id
    });
  };

  const onRemoveUser = () => {
    delContact(selectedId);
    setSelectedId(null); // Clear selection
  };

  const rows = state.contacts.map(contact => (
    <Table.Row
      key={contact.id}
      onClick={() => setSelectedId(contact.id)}
      active={contact.id === selectedId}
    >
      <Table.Cell>{contact.id}</Table.Cell>
      <Table.Cell>{contact.name}</Table.Cell>
      <Table.Cell>{contact.email}</Table.Cell>
    </Table.Row>
  ));

  return (
    <Segment>
      <Table celled striped selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Id</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{rows}</Table.Body>
        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell colSpan="4">
              <Button
                floated="right"
                icon
                labelPosition="left"
                color="red"
                size="small"
                disabled={!selectedId}
                onClick={onRemoveUser}
              >
                <Icon name="trash" /> Remove User
              </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </Segment>
  );
}
