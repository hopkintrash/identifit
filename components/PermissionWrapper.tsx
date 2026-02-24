import React, { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import PermissionScreen from './PermissionScreen';
import PermissionDeniedScreen from './PermissionDeniedScreen';
import PermissionLoadingScreen from './PermissionLoadingScreen';

interface PermissionWrapperProps {
  children: ReactNode;
  requiredPermissions: ('camera' | 'gallery')[];
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
  onSkip?: () => void;
  customTitle?: string;
  customSubtitle?: string;
  loadingMessage?: string;
}

export default function PermissionWrapper({
  children,
  requiredPermissions,
  onPermissionGranted,
  onPermissionDenied,
  onSkip,
  customTitle,
  customSubtitle,
  loadingMessage,
}: PermissionWrapperProps) {
  const {
    permissionState,
    isInitialized,
    requestCameraAccess,
    requestGalleryAccess,
    requestBothPermissions,
    openAppSettings,
    checkGalleryPermission,
  } = usePermissions();

  // Show loading while permissions are being checked
  if (!isInitialized) {
    const permissionType = requiredPermissions.length === 2 ? 'both' : requiredPermissions[0];
    return (
      <PermissionLoadingScreen 
        type={permissionType}
        message={loadingMessage}
      />
    );
  }

  // Check if all required permissions are granted
  const hasAllRequired = requiredPermissions.every(permission => 
    permissionState[permission] === 'granted'
  );

  if (hasAllRequired) {
    return <>{children}</>;
  }

  // Check if any permissions are denied (not just undetermined)
  const deniedPermissions = requiredPermissions.filter(permission => 
    permissionState[permission] === 'denied'
  );

  if (deniedPermissions.length > 0) {
    const permissionType = deniedPermissions.length === 2 ? 'both' : deniedPermissions[0];
    
    return (
      <PermissionDeniedScreen
        type={permissionType}
        onRetry={async () => {
          if (deniedPermissions.includes('camera') && deniedPermissions.includes('gallery')) {
            const result = await requestBothPermissions();
            if (result.camera && result.gallery) {
              onPermissionGranted?.();
            }
          } else if (deniedPermissions.includes('camera')) {
            const granted = await requestCameraAccess();
            if (granted) {
              onPermissionGranted?.();
            }
          } else if (deniedPermissions.includes('gallery')) {
            const granted = await requestGalleryAccess();
            if (granted) {
              onPermissionGranted?.();
            }
          }
        }}
        onSkip={onSkip}
        onOpenSettings={openAppSettings}
      />
    );
  }

  // Show permission request screen for undetermined permissions
  const permissionType = requiredPermissions.length === 2 ? 'both' : requiredPermissions[0];

  return (
    <PermissionScreen
      type={permissionType}
      title={customTitle}
      subtitle={customSubtitle}
      onAllow={async () => {
        if (requiredPermissions.includes('camera') && requiredPermissions.includes('gallery')) {
          const result = await requestBothPermissions();
          if (result.camera && result.gallery) {
            onPermissionGranted?.();
          } else {
            onPermissionDenied?.();
          }
        } else if (requiredPermissions.includes('camera')) {
          const granted = await requestCameraAccess();
          if (granted) {
            onPermissionGranted?.();
          } else {
            onPermissionDenied?.();
          }
        } else if (requiredPermissions.includes('gallery')) {
          const granted = await requestGalleryAccess();
          if (granted) {
            onPermissionGranted?.();
          } else {
            onPermissionDenied?.();
          }
        }
      }}
      onSkip={onSkip}
    />
  );
}