import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Arkansas Ankle Monitor</h2>
          <p className="text-gray-600">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}