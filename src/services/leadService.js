import api from './api';

export const leadService = {
  // Public submission of lead form
  createLead: async (leadData) => {
    const response = await api.post('/leads', leadData);
    return response.data;
  },

  // Client get their own submitted leads
  getMyLeads: async () => {
    const response = await api.get('/leads/my-leads');
    return response.data;
  },

  // Admin get paginated/filtered leads
  getLeads: async ({ page = 1, limit = 10, status = 'All', q = '', sortBy = 'newest', dateRange = 'all' } = {}) => {
    const params = new URLSearchParams({
      page,
      limit,
      status,
      q,
      sortBy,
      dateRange,
    });
    const response = await api.get(`/leads?${params.toString()}`);
    return response.data;
  },

  // Get single lead by ID
  getLeadById: async (id) => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },

  // Search leads directly
  searchLeads: async (query) => {
    const response = await api.get(`/leads/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get Analytics stats for dashboard cards & charts
  getStats: async () => {
    const response = await api.get('/leads/stats');
    return response.data;
  },

  // Update status (New, Contacted, Closed) or lead content
  updateLead: async (id, updateData) => {
    const response = await api.patch(`/leads/${id}`, updateData);
    return response.data;
  },

  // Add internal note to lead
  addNote: async (id, noteData) => {
    const response = await api.post(`/leads/${id}/notes`, noteData);
    return response.data;
  },

  // Send query to AI Assistant Chatbot
  sendAIChat: async (chatPayload) => {
    const response = await api.post('/ai/chat', chatPayload);
    return response.data;
  },

  // Delete lead permanently
  deleteLead: async (id) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  },
};

export default leadService;
