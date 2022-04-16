import axios from 'axios';

const API_URL = '/api/tickets/';

// Create a new ticket
const createTicket = async (ticketData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  const response = await axios.post(
    API_URL,
    JSON.stringify(ticketData),
    config
  );

  return response.data;
};

const getTickets = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  const response = await axios.get(API_URL, config);

  return response.data.tickets;
};

const getTicket = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  const response = await axios.get(API_URL + ticketId, config);

  return response.data.ticket;
};

const closeTicket = async (ticketId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  const response = await axios.put(
    API_URL + ticketId,
    { status: 'closed' },
    config
  );

  return response.data.ticket;
};

const ticketService = { createTicket, getTickets, getTicket, closeTicket };

export default ticketService;
