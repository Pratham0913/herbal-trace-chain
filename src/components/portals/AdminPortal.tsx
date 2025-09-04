import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, Users, Package, Shield, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@/components/LoginSignup';
import { useToast } from '@/hooks/use-toast';

interface AdminPortalProps {
  user: User;
}

interface FraudAlert {
  id: string;
  type: 'duplicate_qr' | 'tampered_qr' | 'fake_certificate' | 'invalid_route';
  batchId: string;
  description: string;
  location: string;
  reportedDate: string;
  status: 'pending' | 'investigating' | 'resolved' | 'false_alarm';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface ApprovalRequest {
  id: string;
  type: 'batch_approval' | 'certificate_verification' | 'new_member' | 'route_change';
  title: string;
  description: string;
  requestedBy: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
}

interface SystemMetrics {
  totalBatches: number;
  activeFarmers: number;
  completedTransactions: number;
  fraudDetectionRate: number;
  systemUptime: number;
  avgProcessingTime: number;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ user }) => {
  const { toast } = useToast();

  const [fraudAlerts] = useState<FraudAlert[]>([
    {
      id: 'FA001',
      type: 'duplicate_qr',
      batchId: 'HB-TUR001',
      description: 'Duplicate QR code detected in different locations',
      location: 'Karnataka & Maharashtra',
      reportedDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      severity: 'critical'
    },
    {
      id: 'FA002',
      type: 'tampered_qr',
      batchId: 'HB-GIN002',
      description: 'QR code data appears to be modified',
      location: 'Tamil Nadu',
      reportedDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      status: 'investigating',
      severity: 'high'
    },
    {
      id: 'FA003',
      type: 'fake_certificate',
      batchId: 'HB-NEE003',
      description: 'Invalid quality certificate detected',
      location: 'Gujarat',
      reportedDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      status: 'resolved',
      severity: 'medium'
    }
  ]);

  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([
    {
      id: 'AR001',
      type: 'batch_approval',
      title: 'Batch Quality Verification Required',
      description: 'New turmeric batch from farmer F007 requires quality approval',
      requestedBy: 'Processor PR001',
      requestDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      priority: 'high'
    },
    {
      id: 'AR002',
      type: 'new_member',
      title: 'New Aggregator Registration',
      description: 'Aggregator AG005 from Kerala requesting platform access',
      requestedBy: 'System',
      requestDate: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      priority: 'medium'
    },
    {
      id: 'AR003',
      type: 'certificate_verification',
      title: 'Certificate Re-verification',
      description: 'Quality certificate for batch HB-ASH005 needs manual verification',
      requestedBy: 'QA Team',
      requestDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      priority: 'medium'
    }
  ]);

  const [systemMetrics] = useState<SystemMetrics>({
    totalBatches: 1247,
    activeFarmers: 89,
    completedTransactions: 2156,
    fraudDetectionRate: 97.8,
    systemUptime: 99.9,
    avgProcessingTime: 4.2
  });

  const handleApproval = (requestId: string, action: 'approved' | 'rejected') => {
    setApprovalRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: action }
          : req
      )
    );

    toast({
      title: `Request ${action}`,
      description: `Approval request ${requestId} has been ${action}`,
    });
  };

  const getSeverityColor = (severity: FraudAlert['severity']) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  const getStatusColor = (status: FraudAlert['status']) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'investigating': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'false_alarm': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: ApprovalRequest['priority']) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* System Metrics */}
      <div className="grid md:grid-cols-6 gap-4">
        <Card className="portal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Batches</p>
                <p className="text-xl font-bold">{systemMetrics.totalBatches.toLocaleString()}</p>
              </div>
              <Package className="w-6 h-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="portal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Farmers</p>
                <p className="text-xl font-bold">{systemMetrics.activeFarmers}</p>
              </div>
              <Users className="w-6 h-6 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="portal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-xl font-bold">{systemMetrics.completedTransactions.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-6 h-6 text-herbal-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="portal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fraud Detection</p>
                <p className="text-xl font-bold text-success">{systemMetrics.fraudDetectionRate}%</p>
              </div>
              <Shield className="w-6 h-6 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="portal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Uptime</p>
                <p className="text-xl font-bold text-success">{systemMetrics.systemUptime}%</p>
              </div>
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="portal-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Process Time</p>
                <p className="text-xl font-bold">{systemMetrics.avgProcessingTime}h</p>
              </div>
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fraud Alerts */}
      <Card className="portal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Fraud Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fraudAlerts.filter(alert => alert.status !== 'resolved').map((alert) => (
              <div key={alert.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-destructive">{alert.description}</h3>
                    <p className="text-sm text-muted-foreground">
                      Batch ID: {alert.batchId} • Location: {alert.location}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Reported: {formatDate(alert.reportedDate)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(alert.status)}>
                      {alert.status.toUpperCase().replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="herbal-gradient">
                    Investigate
                  </Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    Mark Resolved
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Approval Requests */}
      <Card className="portal-card">
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {approvalRequests.filter(req => req.status === 'pending').map((request) => (
              <div key={request.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{request.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {request.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Requested by: {request.requestedBy} • {formatDate(request.requestDate)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getPriorityColor(request.priority)}>
                      {request.priority.toUpperCase()} PRIORITY
                    </Badge>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleApproval(request.id, 'approved')}
                    className="herbal-gradient"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleApproval(request.id, 'rejected')}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card className="portal-card">
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">System Uptime</span>
                    <span className="text-sm font-medium">{systemMetrics.systemUptime}%</span>
                  </div>
                  <Progress value={systemMetrics.systemUptime} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Fraud Detection Rate</span>
                    <span className="text-sm font-medium">{systemMetrics.fraudDetectionRate}%</span>
                  </div>
                  <Progress value={systemMetrics.fraudDetectionRate} className="h-2" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>System backup completed successfully</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <span>High traffic detected in Karnataka region</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>New batch processing algorithm deployed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>All security checks passed</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPortal;