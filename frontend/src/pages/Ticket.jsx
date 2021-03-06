import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { closeTicket, getTicket } from '../features/tickets/ticketSlice';
import BackButton from '../components/BackButton';
import { getNotes, reset as notesReset } from '../features/notes/noteSlice';
import NoteItem from '../components/NoteItem';

function Ticket() {
  const { isLoading, ticket, isError, isSuccess, message } = useSelector(
    ({ tickets }) => tickets
  );

  const { notes, isLoading: notesIsLoading } = useSelector(
    ({ notes }) => notes
  );

  const params = useParams();
  const { ticketId } = params;

  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    dispatch(getTicket(ticketId));
    dispatch(getNotes(ticketId));
  }, [isError, message, ticketId, dispatch]);

  const onTicketClose = () => {
    dispatch(closeTicket(ticketId));
    toast.success('Ticket Closed');
    navigate('/tickets');
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h3>Something went wrong</h3>;
  }

  return (
    <div className="ticket-page">
      <header className="ticket-header">
        <BackButton url="/tickets" />
        <h2>
          Ticket ID: {ticket._id}
          <span className={`status status-${ticket.status}`}>
            {ticket.status}
          </span>
        </h2>
        <h3>
          Date Submitted: {new Date(ticket.createdAt).toLocaleString('en-US')}
        </h3>
        <h3>Product: {ticket.product}</h3>
        <hr />
        <div className="ticket-desc">
          <h3>Description of Issue</h3>
          <p>{ticket.description}</p>
        </div>
      </header>
      <h3>Notes</h3>
      {notes.notes &&
        notes.notes.map((note) => <NoteItem key={note._id} note={note} />)}

      {ticket.status !== 'closed' && (
        <button onClick={onTicketClose} className="btn btn-block btn-danger">
          Close Ticket
        </button>
      )}
    </div>
  );
}

export default Ticket;
