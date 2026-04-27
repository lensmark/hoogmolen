/**
 * AdminMedia — combineert upload + audit-historiek + alias-systeem.
 */
import { useState } from "react";
import { Upload, History, AlertTriangle, Activity, Network } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MediaUploadPanel from "@/components/admin/MediaUploadPanel";
import MediaHistoryPanel from "@/components/admin/MediaHistoryPanel";
import MediaIssuesPanel from "@/components/admin/MediaIssuesPanel";
import SyncHistoryPanel from "@/components/admin/SyncHistoryPanel";
import CodeSyncPanel from "@/components/admin/CodeSyncPanel";

const AdminMedia = () => {
  const [tab, setTab] = useState("upload");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl text-primary-deep">Media &amp; Uploads</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload foto's, los naamconventie-issues op, raadpleeg de audit-historiek en
          beheer code-aliassen.
        </p>
      </header>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="upload">
            <Upload className="w-4 h-4 mr-2" /> Upload
          </TabsTrigger>
          <TabsTrigger value="issues">
            <AlertTriangle className="w-4 h-4 mr-2" /> Issues
          </TabsTrigger>
          <TabsTrigger value="codesync">
            <Network className="w-4 h-4 mr-2" /> Code Sync
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="w-4 h-4 mr-2" /> Activity
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" /> Library
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="mt-6">
          <MediaUploadPanel />
        </TabsContent>
        <TabsContent value="issues" className="mt-6">
          <MediaIssuesPanel />
        </TabsContent>
        <TabsContent value="codesync" className="mt-6">
          <CodeSyncPanel />
        </TabsContent>
        <TabsContent value="activity" className="mt-6">
          <SyncHistoryPanel />
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <MediaHistoryPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminMedia;
