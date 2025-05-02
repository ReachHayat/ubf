
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { enrollmentService, CourseEnrollment } from '@/services/enrollmentService';
import { useToast } from '@/components/ui/use-toast';

const CourseEnrollments: React.FC = () => {
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchAllEnrollments = async () => {
      setLoading(true);
      try {
        const allEnrollments = await enrollmentService.getAllEnrollments();
        setEnrollments(allEnrollments);
        setFilteredEnrollments(allEnrollments);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
        toast({
          title: 'Error fetching enrollments',
          description: 'Failed to load enrollment data. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllEnrollments();
  }, [toast]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEnrollments(enrollments);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = enrollments.filter(
      enrollment => 
        enrollment.courses?.title?.toLowerCase().includes(lowerCaseQuery) ||
        enrollment.user_id.toLowerCase().includes(lowerCaseQuery)
    );
    
    setFilteredEnrollments(filtered);
  }, [searchQuery, enrollments]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'not_started':
        return <Badge variant="outline">Not Started</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Enrollments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search enrollments..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Enrolled At</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Accessed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnrollments.length > 0 ? (
                  filteredEnrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell className="font-medium">{enrollment.courses?.title || 'Unknown Course'}</TableCell>
                      <TableCell>{enrollment.user_id}</TableCell>
                      <TableCell>{new Date(enrollment.enrolled_at).toLocaleDateString()}</TableCell>
                      <TableCell>{enrollment.progress}%</TableCell>
                      <TableCell>{getStatusBadge(enrollment.completion_status)}</TableCell>
                      <TableCell>{new Date(enrollment.last_accessed_at).toLocaleString()}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                      No enrollments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseEnrollments;
