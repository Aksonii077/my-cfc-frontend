import { toast } from "sonner";
import { Resource } from "./resourceUtils";

/**
 * Improved resource access handler
 * This makes sure resources are properly accessed based on their type
 */
export const accessResource = (resource: Resource): void => {
  // Log the action
  console.log('Accessing resource:', resource.id, resource.title);
  
  // First check if the resource is premium (gate-keeping)
  if (resource.isPremium) {
    toast.info("This is a premium resource. Upgrade to access this content.");
    return;
  }
  
  // Handle hosted resources directly on our platform
  if (resource.isHosted) {
    toast.success(`Opening ${resource.title} in our viewer`);
    
    // For demo purposes, we'll just show a success message
    // In a real app, this would redirect to a resource viewer component
    setTimeout(() => {
      toast.success(`${resource.title} loaded successfully!`);
    }, 1000);
    return;
  }
  
  // Handle different resource types
  if (resource.type === 'video') {
    // For videos, open in a new tab
    toast.success(`Opening video: ${resource.title}`);
    
    // Simulate opening the video
    setTimeout(() => {
      toast.success(`${resource.title} is now playing`);
    }, 1000);
  } else if (resource.link.startsWith('http')) {
    // External links should open in a new tab
    window.open(resource.link, '_blank');
    toast.success(`Opening external resource: ${resource.title}`);
  } else {
    // Downloadable resources
    toast.loading(`Preparing ${resource.title} for download...`);
    
    // Simulate download process
    setTimeout(() => {
      toast.dismiss();
      toast.success(`${resource.title} downloaded successfully!`);
    }, 1500);
  }
};

/**
 * Handle clicking on a tool in the startup tools page
 */
export const accessTool = (tool: any): void => {
  console.log('Accessing tool:', tool.id, tool.title);
  
  // Check if premium
  if (tool.isPremium) {
    toast.info("This is a premium tool. Upgrade to access all features.");
    return;
  }
  
  // If it's an external tool, open the link
  if (tool.link.startsWith('http')) {
    window.open(tool.link, '_blank');
    return;
  }
  
  // For internal tools, navigate to the tool page
  if (tool.link.startsWith('/')) {
    window.location.href = tool.link;
  } else {
    // Fallback to opening in the same window if path format is unexpected
    window.location.href = `/tools/${tool.id}`;
  }
};
