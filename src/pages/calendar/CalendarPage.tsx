import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Meeting {
  id: string;
  title: string;
  date: Date;
  time: string;
  with: string;
  status: 'pending' | 'confirmed' | 'declined';
}

interface AvailabilitySlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
}

const initialMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Investment Discussion',
    date: new Date(),
    time: '10:00 AM',
    with: 'Michael Rodriguez',
    status: 'confirmed',
  },
  {
    id: '2',
    title: 'Startup Pitch Review',
    date: new Date(Date.now() + 86400000 * 2),
    time: '2:00 PM',
    with: 'Jennifer Lee',
    status: 'pending',
  },
];

const initialSlots: AvailabilitySlot[] = [
  {
    id: '1',
    date: new Date(),
    startTime: '09:00',
    endTime: '11:00',
  },
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [slots, setSlots] = useState<AvailabilitySlot[]>(initialSlots);
  const [activeTab, setActiveTab] = useState<'calendar' | 'meetings' | 'availability'>('calendar');

  // New meeting form state
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    time: '',
    with: '',
  });

  // New slot form state
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [newSlot, setNewSlot] = useState({
    startTime: '',
    endTime: '',
  });

  const selectedDateObj =
    selectedDate instanceof Date ? selectedDate : Array.isArray(selectedDate) ? selectedDate[0] : new Date();

  const meetingsOnSelected = meetings.filter(
    (m) => m.date.toDateString() === selectedDateObj?.toDateString()
  );

  const hasMeeting = (date: Date) =>
    meetings.some((m) => m.date.toDateString() === date.toDateString());

  const handleAddMeeting = () => {
    if (!newMeeting.title || !newMeeting.time || !newMeeting.with) return;
    const meeting: Meeting = {
      id: Date.now().toString(),
      title: newMeeting.title,
      date: selectedDateObj || new Date(),
      time: newMeeting.time,
      with: newMeeting.with,
      status: 'pending',
    };
    setMeetings([...meetings, meeting]);
    setNewMeeting({ title: '', time: '', with: '' });
    setShowMeetingForm(false);
  };

  const handleStatusChange = (id: string, status: Meeting['status']) => {
    setMeetings(meetings.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  const handleAddSlot = () => {
    if (!newSlot.startTime || !newSlot.endTime) return;
    const slot: AvailabilitySlot = {
      id: Date.now().toString(),
      date: selectedDateObj || new Date(),
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
    };
    setSlots([...slots, slot]);
    setNewSlot({ startTime: '', endTime: '' });
    setShowSlotForm(false);
  };

  const handleDeleteSlot = (id: string) => {
    setSlots(slots.filter((s) => s.id !== id));
  };

  const statusColor = (status: Meeting['status']) => {
    if (status === 'confirmed') return 'bg-green-100 text-green-700';
    if (status === 'declined') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meeting Calendar</h1>
        <p className="text-gray-500 mt-1">Manage your meetings and availability slots</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {(['calendar', 'meetings', 'availability'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileClassName={({ date }) =>
                hasMeeting(date) ? 'has-meeting' : null
              }
            />
            <style>{`
              .has-meeting { background-color: #dbeafe !important; border-radius: 50%; color: #1d4ed8; font-weight: bold; }
              .react-calendar { border: none !important; width: 100% !important; font-family: inherit !important; }
              .react-calendar__tile--active { background: #2563eb !important; border-radius: 8px !important; }
              .react-calendar__tile:hover { background: #eff6ff !important; border-radius: 8px !important; }
              .react-calendar__navigation button:hover { background: #eff6ff !important; border-radius: 8px !important; }
            `}</style>
          </div>

          {/* Selected Date Meetings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">
                {selectedDateObj?.toDateString()}
              </h2>
              <button
                onClick={() => setShowMeetingForm(true)}
                className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
              >
                + Add Meeting
              </button>
            </div>

            {/* Add Meeting Form */}
            {showMeetingForm && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Meeting title"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                />
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="With (person name)"
                  value={newMeeting.with}
                  onChange={(e) => setNewMeeting({ ...newMeeting, with: e.target.value })}
                />
                <input
                  type="time"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newMeeting.time}
                  onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddMeeting}
                    className="flex-1 bg-blue-600 text-white text-sm py-1.5 rounded-lg hover:bg-blue-700 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowMeetingForm(false)}
                    className="flex-1 bg-gray-100 text-gray-600 text-sm py-1.5 rounded-lg hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {meetingsOnSelected.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No meetings on this date</p>
            ) : (
              <div className="space-y-3">
                {meetingsOnSelected.map((meeting) => (
                  <div key={meeting.id} className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{meeting.title}</p>
                        <p className="text-gray-500 text-xs mt-0.5">with {meeting.with} · {meeting.time}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(meeting.status)}`}>
                        {meeting.status}
                      </span>
                    </div>
                    {meeting.status === 'pending' && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleStatusChange(meeting.id, 'confirmed')}
                          className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusChange(meeting.id, 'declined')}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Meetings Tab */}
      {activeTab === 'meetings' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h2 className="font-semibold text-gray-800 mb-4">All Meetings</h2>
          <div className="space-y-3">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{meeting.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {meeting.date.toDateString()} · {meeting.time} · with {meeting.with}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(meeting.status)}`}>
                    {meeting.status}
                  </span>
                  {meeting.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(meeting.id, 'confirmed')}
                        className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusChange(meeting.id, 'declined')}
                        className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                      >
                        Decline
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Availability Tab */}
      {activeTab === 'availability' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Availability Slots</h2>
            <button
              onClick={() => setShowSlotForm(true)}
              className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
            >
              + Add Slot
            </button>
          </div>

          {showSlotForm && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-gray-600 mb-2">
                Adding slot for: <strong>{selectedDateObj?.toDateString()}</strong>
              </p>
              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Start Time</label>
                  <input
                    type="time"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">End Time</label>
                  <input
                    type="time"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddSlot}
                  className="flex-1 bg-blue-600 text-white text-sm py-1.5 rounded-lg hover:bg-blue-700 transition"
                >
                  Save Slot
                </button>
                <button
                  onClick={() => setShowSlotForm(false)}
                  className="flex-1 bg-gray-100 text-gray-600 text-sm py-1.5 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {slots.map((slot) => (
              <div key={slot.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{slot.date.toDateString()}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{slot.startTime} – {slot.endTime}</p>
                </div>
                <button
                  onClick={() => handleDeleteSlot(slot.id)}
                  className="text-xs text-red-500 hover:text-red-700 transition"
                >
                  Remove
                </button>
              </div>
            ))}
            {slots.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-8">No availability slots added</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}