import { Route } from '@angular/router';

export const agencyFeatureDashboardRoutes: Route[] = [
  {
    loadComponent: () => import('./components/dashboard').then(module => module.DashboardComponent),
    path: '',
  },
  {
    children: [
      {
        data: { activeTab: 'notes' },
        loadComponent: () => import('./components/notes').then(module => module.NotesComponent),
        path: 'notes',
      },
      {
        data: { activeTab: 'notes' },
        loadComponent: () => import('./components/notes/note-form').then(module => module.NoteFormComponent),
        path: 'notes/add-note',
      },
      {
        loadComponent: () => import('./components/notes/note-form').then(module => module.NoteFormComponent),
        path: 'notes/:noteId',
      },
      {
        data: { activeTab: 'events' },
        loadComponent: () => import('./components/transaction-events').then(module => module.TransactionEventsComponent),
        path: 'events',
      },
      {
        data: { activeTab: 'review' },
        loadComponent: () => import('./components/review').then(module => module.ReviewFormComponent),
        path: 'detail',
      },
      {
        children: [
          {
            loadComponent: () => import('@dsg/shared/feature/messaging').then(module => module.MessagesComponent),
            path: '',
          },
          {
            loadComponent: () => import('@dsg/shared/feature/messaging').then(module => module.NewConversationComponent),
            path: 'new-message',
          },
        ],
        data: { activeTab: 'messages' },
        loadComponent: () => import('./components/transaction-messages').then(module => module.TransactionMessagesComponent),
        path: 'messages',
      },
      { path: '**', redirectTo: 'detail' },
    ],
    loadComponent: () => import('./components/transaction-detail').then(module => module.TransactionDetailComponent),
    path: 'transaction/:transactionId',
  },
  { path: '**', redirectTo: '' },
];
