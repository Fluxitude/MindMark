// Cult UI Design System Demo Page
// Comprehensive showcase of all Cult UI components

"use client";

import { useState } from "react";
import { Button } from "@mindmark/ui/button";
import { Input } from "@mindmark/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@mindmark/ui/card";
import { Label } from "@mindmark/ui/label";
import { Switch } from "@mindmark/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@mindmark/ui/select";
import { Checkbox } from "@mindmark/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@mindmark/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@mindmark/ui/dialog";
import { Skeleton, SkeletonCard, SkeletonText, SkeletonAvatar } from "@mindmark/ui/skeleton";
import { Spinner, LoadingButton, LoadingOverlay } from "@mindmark/ui/spinner";
import { Toast, ToastProvider, useToast } from "@mindmark/ui/toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@mindmark/ui/tooltip";
import { Badge } from "@mindmark/ui/badge";
import { 
  Heart, 
  Star, 
  Settings, 
  User, 
  Mail, 
  Phone,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

function DemoContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState("option1");
  const [selectValue, setSelectValue] = useState("");
  const { addToast } = useToast();

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  const showToast = (variant: "default" | "success" | "warning" | "destructive" | "info") => {
    addToast({
      variant,
      title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Toast`,
      description: `This is a ${variant} toast notification with Cult UI styling.`
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Cult UI Design System</h1>
          <p className="text-xl text-muted-foreground">
            Neomorphic components for MindMark with cognitive accessibility
          </p>
        </div>

        {/* Buttons Section */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="destructive">Destructive Button</Button>
              <Button variant="link">Link Button</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon"><Heart className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <LoadingButton isLoading={isLoading} onClick={handleLoadingDemo}>
                {isLoading ? "Loading..." : "Start Loading"}
              </LoadingButton>
              <Button disabled>Disabled Button</Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Components */}
        <Card>
          <CardHeader>
            <CardTitle>Form Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Inputs */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>

            {/* Select */}
            <div className="space-y-2">
              <Label>Select Option</Label>
              <Select value={selectValue} onValueChange={setSelectValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Switch */}
            <div className="flex items-center space-x-2">
              <Switch 
                id="notifications" 
                checked={switchValue}
                onCheckedChange={setSwitchValue}
              />
              <Label htmlFor="notifications">Enable notifications</Label>
            </div>

            {/* Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={checkboxValue}
                onCheckedChange={(checked) => setCheckboxValue(checked === true)}
              />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>

            {/* Radio Group */}
            <div className="space-y-2">
              <Label>Choose your preference</Label>
              <RadioGroup value={radioValue} onValueChange={setRadioValue}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option1" id="r1" />
                  <Label htmlFor="r1">Option 1</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option2" id="r2" />
                  <Label htmlFor="r2">Option 2</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option3" id="r3" />
                  <Label htmlFor="r3">Option 3</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Loading States */}
        <Card className="relative">
          <CardHeader>
            <CardTitle>Loading States</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Spinners */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Spinners</h3>
              <div className="flex items-center gap-4">
                <Spinner size="sm" />
                <Spinner size="default" />
                <Spinner size="lg" />
                <Spinner size="xl" />
              </div>
              <div className="flex items-center gap-4">
                <Spinner variant="default" />
                <Spinner variant="muted" />
                <Spinner variant="destructive" />
                <Spinner variant="success" />
              </div>
            </div>

            {/* Skeletons */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Skeletons</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SkeletonCard />
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <SkeletonAvatar />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                  <SkeletonText lines={3} />
                </div>
              </div>
            </div>
          </CardContent>
          
          {isLoading && (
            <LoadingOverlay isLoading={isLoading}>
              Loading demo content...
            </LoadingOverlay>
          )}
        </Card>

        {/* Interactive Components */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dialog */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Dialog</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cult UI Dialog</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>This is a beautiful neomorphic dialog with Cult UI styling.</p>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Confirm</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Tooltips */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Tooltips</h3>
              <div className="flex gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">Hover me</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This is a Cult UI tooltip</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Toast Notifications */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Toast Notifications</h3>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => showToast("default")} variant="outline">
                  Default Toast
                </Button>
                <Button onClick={() => showToast("success")} variant="outline">
                  Success Toast
                </Button>
                <Button onClick={() => showToast("warning")} variant="outline">
                  Warning Toast
                </Button>
                <Button onClick={() => showToast("destructive")} variant="outline">
                  Error Toast
                </Button>
                <Button onClick={() => showToast("info")} variant="outline">
                  Info Toast
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges and Icons */}
        <Card>
          <CardHeader>
            <CardTitle>Badges & Icons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
            <div className="flex gap-4 text-muted-foreground">
              <User className="h-6 w-6" />
              <Mail className="h-6 w-6" />
              <Phone className="h-6 w-6" />
              <Settings className="h-6 w-6" />
              <Star className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CultUIDemoPage() {
  return (
    <ToastProvider>
      <DemoContent />
    </ToastProvider>
  );
}
