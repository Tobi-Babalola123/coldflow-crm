"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card } from "@/components/cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Send, Upload, Paperclip, FileText, MoreVertical } from "lucide-react";
import { sendEmailJS } from "@/lib/emailjs";
import emailjs from "@emailjs/nodejs";

const templates = {
  "1": {
    subject: "Frontend Developer Opportunity",
    content: `Hello Hiring Team,

My name is Tobi Babalola, a Frontend Developer specializing in React, Next.js and TypeScript.

I came across your company and would love to explore opportunities where I can contribute to your team.

My CV is attached below for your review.

I look forward to hearing from you..

Kind regards,
Tobi Babalola`,
  },

  "2": {
    subject: "Following Up On My Previous Email",
    content: `Hello,

I hope you're doing well.

I'm following up on the email I sent previously regarding potential opportunities within your organization.

I remain very interested and would appreciate any update when convenient.

Thank you for your time.

Kind regards,
Tobi Babalola`,
  },

  "3": {
    subject: "Proposal For Collaboration",
    content: `Hello,

Thank you for your time and consideration.

I would love to discuss how my frontend development experience can contribute to your organization's goals.

Please let me know if you'd be available for a brief conversation.

Best regards,
Tobi Babalola`,
  },

  "4": {
    subject: "Final Follow Up",
    content: `Hello,

I wanted to send one final follow-up regarding my previous emails.

I appreciate your time and consideration.

Should an opportunity arise in the future, I would be delighted to connect.

Best regards,
Tobi Babalola`,
  },
};

export default function ComposePage() {
  const [subject, setSubject] = useState("");
  const [to, setTo] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setSelectedTemplate(value);

    if (!value) {
      setSubject("");
      setContent("");
      return;
    }

    const template = templates[value as keyof typeof templates];

    setSubject(template.subject);
    setContent(template.content);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();

      const sessionUser = data.session?.user || null;

      console.log("SESSION CHECK:", data);

      setUser(sessionUser);

      if (!sessionUser) {
        router.push("/login");
      }
    };

    checkAuth();
  }, []);

  const uploadCV = async (file: File) => {
    if (!user) {
      throw new Error("Session expired. Please login again.");
    }

    const extension = file.name.split(".").pop();

    const filePath = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from("cv-files")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      throw new Error("CV upload failed");
    }

    return filePath;
  };

  const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    setAttachments((prev) => [...prev, ...files]);
  };

  const handleSendEmail = async () => {
    try {
      setUploading(true);

      // Validation
      if (!to.trim()) {
        throw new Error("Recipient email is required");
      }

      if (!subject.trim()) {
        throw new Error("Subject is required");
      }

      if (!content.trim()) {
        throw new Error("Message cannot be empty");
      }

      if (!user) {
        throw new Error("Session expired. Please login again.");
      }

      let cvPath: string | null = null;
      let cvUrl: string | null = null;

      // Upload CV first
      if (attachments.length > 0) {
        cvPath = await uploadCV(attachments[0]);

        const { data } = supabase.storage.from("cv-files").getPublicUrl(cvPath);

        cvUrl = data.publicUrl;
      }

      const messageWithCV = cvUrl
        ? `${content}

--------------------------------

CV / Resume:
${cvUrl}`
        : content;

      // ================================
      // EMAILJS SEND (REPLACEMENT HERE)
      // ================================
      const emailRes = await emailjs.send(
        process.env.EMAILJS_SERVICE_ID!,
        process.env.EMAILJS_TEMPLATE_ID!,
        {
          to_email: to,
          subject: subject,
          message: messageWithCV,
          company_name: companyName,
          company_website: companyWebsite,
          // name: "companyName", //
        },
        process.env.EMAILJS_PUBLIC_KEY!,
      );

      console.log("EMAILJS RESPONSE:", emailRes);

      // Optional safety check
      if (emailRes.status !== 200) {
        throw new Error("Email sending failed via EmailJS");
      }

      // ================================
      // SAVE LEAD (UNCHANGED)
      // ================================
      const { error } = await supabase.from("leads").insert({
        company_email: to,
        company_name: companyName || "Unknown",
        company_website: companyWebsite || null,

        subject,
        message: content,

        cv_url: cvPath,

        status: "sent",

        sent_date: new Date().toISOString(),

        last_contact_date: new Date().toISOString(),

        last_email_type: "initial",

        follow_up_count: 0,

        auto_followup_enabled: true,

        follow_up_date: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      });

      if (error) {
        console.error("Lead insert error:", error);
        throw new Error(error.message);
      }

      alert("Email sent & lead saved successfully!");

      // Reset form
      setTo("");
      setSubject("");
      setContent("");
      setAttachments([]);
      setCompanyName("");
      setCompanyWebsite("");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to send email / save lead");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Compose Email</h1>
        <p className="text-muted-foreground mt-2">
          Send a personalized cold outreach email
        </p>
      </div>

      {/* Compose Form */}
      <div className="max-w-4xl space-y-6">
        {/* Company Info */}
        <Card>
          <div className="space-y-4">
            {/* Company Name (NEW) */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Company Name
              </label>
              <Input
                type="text"
                placeholder="Enter company name..."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            {/* Company Website (OPTIONAL BUT USEFUL) */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Company Website (optional)
              </label>
              <Input
                type="text"
                placeholder="https://company.com"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
              />
            </div>

            {/* Send To */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Send To
              </label>
              <Input
                type="email"
                placeholder="Enter recipient email address..."
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                You can send to multiple recipients by separating emails with
                commas
              </p>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Subject
              </label>
              <Input
                type="text"
                placeholder="Email subject line..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Use Template
              </label>
              <select
                value={selectedTemplate}
                onChange={handleTemplateChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground text-sm"
              >
                <option value="">Start from blank</option>
                <option value="1">Initial Outreach</option>
                <option value="2">Follow-up - No Response</option>
                <option value="3">Proposal</option>
                <option value="4">Closing</option>
              </select>
            </div>
          </div>
        </Card>
        {/* Message Editor (UNCHANGED) */}
        <Card title="Message" description="Compose your email message">
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your message here... Use {{name}}, {{company}}, {{industry}} for personalization"
              rows={12}
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
            />
          </div>
        </Card>
        {/* Attachments */}{" "}
        <Card title="Attachments" description="Add files to your email">
          {" "}
          <div>
            {" "}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors">
              {" "}
              <input
                type="file"
                multiple
                onChange={handleAddAttachment}
                className="hidden"
              />{" "}
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />{" "}
              <p className="text-sm font-medium text-foreground">
                {" "}
                Click to upload or drag and drop{" "}
              </p>{" "}
              <p className="text-xs text-muted-foreground">
                {" "}
                PNG, JPG, PDF up to 10MB each{" "}
              </p>{" "}
            </label>{" "}
            {/* Attached Files */}{" "}
            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {" "}
                <p className="text-sm font-medium text-foreground">
                  {" "}
                  Attachments ({attachments.length}){" "}
                </p>{" "}
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    {" "}
                    <div className="flex items-center gap-2">
                      {" "}
                      <FileText className="h-4 w-4 text-muted-foreground" />{" "}
                      <span className="text-sm text-foreground">
                        {" "}
                        {file.name}{" "}
                      </span>{" "}
                    </div>{" "}
                    <button className="text-muted-foreground hover:text-foreground">
                      {" "}
                      <MoreVertical className="h-4 w-4" />{" "}
                    </button>{" "}
                  </div>
                ))}{" "}
              </div>
            )}{" "}
          </div>{" "}
        </Card>{" "}
        {/* Action Buttons */}{" "}
        <div className="flex gap-3 justify-end">
          {" "}
          <Button variant="outline">Save Draft</Button>{" "}
          <Button
            className="gap-2"
            onClick={handleSendEmail}
            disabled={uploading}
          >
            {" "}
            <Send className="h-4 w-4" />{" "}
            {uploading ? "Sending..." : "Send Email"}{" "}
          </Button>{" "}
        </div>
      </div>
    </div>
  );
}
