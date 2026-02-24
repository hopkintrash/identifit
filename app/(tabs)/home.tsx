import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActionSheetIOS,
  Platform,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Plus, Calendar } from 'lucide-react-native';
import {
  useFonts,
  Caladea_400Regular,
  Caladea_700Bold,
} from '@expo-google-fonts/caladea';
import {
  WorkSans_400Regular,
  WorkSans_500Medium,
  WorkSans_600SemiBold,
} from '@expo-google-fonts/work-sans';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import PermissionWrapper from '@/components/PermissionWrapper';
import { usePermissions } from '@/hooks/usePermissions';
import { useOOTD } from '@/hooks/useOOTD';
import { currentUser } from '@/data/ootd';
import { spacing, fontSize, size, radius } from '@/lib/theme';

export default function HomeScreen() {
  const {
    hasCameraPermission,
    hasGalleryPermission,
    requestCameraAccess,
    requestGalleryAccess,
  } = usePermissions();
  const { saveOOTD, getOOTDForDate, getRecentOOTDs, userOOTDs, deleteOOTD, getTopStyles } =
    useOOTD();
  const cameraRef = React.useRef<any>(null);
  const [showCamera, setShowCamera] = React.useState(false);
  const [facing, setFacing] = React.useState<CameraType>('back');
  const [showCameraPermission, setShowCameraPermission] = React.useState(false);
  const [showGalleryPermission, setShowGalleryPermission] =
    React.useState(false);
  const [logoOpacity] = React.useState(new Animated.Value(0));
  const [logoTranslateY] = React.useState(new Animated.Value(20));
  const [hasTriggeredHaptic, setHasTriggeredHaptic] = React.useState(false);

  const [fontsLoaded] = useFonts({
    'Caladea-Regular': Caladea_400Regular,
    'Caladea-Bold': Caladea_700Bold,
    'WorkSans-Regular': WorkSans_400Regular,
    'WorkSans-Medium': WorkSans_500Medium,
    'WorkSans-SemiBold': WorkSans_600SemiBold,
  });

  // Force re-render when OOTDs change
  React.useEffect(() => {
    // This will trigger a re-render when userOOTDs changes
  }, [userOOTDs]);

  if (!fontsLoaded) {
    return null;
  }

  const handleAddOutfit = () => {
    // Trigger haptic feedback on button press
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Alert.alert(
      "Upload Today's OOTD",
      'Add your outfit of the day to your collection',
      [
        {
          text: 'Take Photo',
          onPress: openCamera,
        },
        {
          text: 'Photo Library',
          onPress: pickImageFromLibrary,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const pickImageFromLibrary = async () => {
    if (!hasGalleryPermission()) {
      setShowGalleryPermission(true);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      // Handle the selected image
      console.log('Selected image:', result.assets[0].uri);

      // Save the OOTD
      const newOOTD = saveOOTD(result.assets[0].uri, {
        occasion: 'casual', // Could be determined from context or user input
        weather: 'sunny', // Could be fetched from weather API
        isPrivate: false,
      });

      Alert.alert('Success', 'Your OOTD has been saved and shared!');
    }
  };

  const openCamera = async () => {
    if (!hasCameraPermission()) {
      setShowCameraPermission(true);
      return;
    }

    setShowCamera(true);
  };

  const takePicture = async (camera: any) => {
    if (camera) {
      const photo = await camera.takePictureAsync({
        quality: 1,
        base64: false,
      });

      setShowCamera(false);
      console.log('Photo taken:', photo.uri);

      // Save the OOTD
      const newOOTD = saveOOTD(photo.uri, {
        occasion: 'casual',
        weather: 'sunny',
        isPrivate: false,
      });

      Alert.alert('Success', 'Your OOTD has been captured and shared!');
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const handleLongPressOOTD = (day: any) => {
    if (!day.hasOutfit || !day.ootd) return;

    // Trigger haptic feedback on long press
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Delete Photo'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
          title: 'Manage OOTD',
          message: `What would you like to do with your outfit from ${day.day}, ${day.date}?`,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            // Delete option selected
            Alert.alert(
              'Delete OOTD',
              'Are you sure you want to delete this outfit? This action cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => {
                    deleteOOTD(day.ootd.id);
                    Alert.alert('Deleted', 'Your OOTD has been deleted.');
                  },
                },
              ]
            );
          }
        }
      );
    } else {
      // Android fallback
      Alert.alert(
        'Manage OOTD',
        `What would you like to do with your outfit from ${day.day}, ${day.date}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete Photo',
            style: 'destructive',
            onPress: () => {
              Alert.alert(
                'Delete OOTD',
                'Are you sure you want to delete this outfit? This action cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                      deleteOOTD(day.ootd.id);
                      Alert.alert('Deleted', 'Your OOTD has been deleted.');
                    },
                  },
                ]
              );
            },
          },
        ]
      );
    }
  };

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isAtBottom =
      contentOffset.y >= contentSize.height - layoutMeasurement.height;
    const overscrollAmount =
      contentOffset.y - (contentSize.height - layoutMeasurement.height);

    // Show logo when overscrolling at bottom by more than 20px
    if (isAtBottom && overscrollAmount > 20) {
      // Trigger haptic feedback only once per scroll session
      if (!hasTriggeredHaptic && Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setHasTriggeredHaptic(true);
      }

      // Animate logo in
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset haptic trigger when not overscrolling
      if (overscrollAmount <= 0) {
        setHasTriggeredHaptic(false);
      }

      // Animate logo out
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: 20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  // Show camera permission screen
  if (showCameraPermission) {
    return (
      <PermissionWrapper
        requiredPermissions={['camera']}
        onPermissionGranted={() => {
          setShowCameraPermission(false);
          setShowCamera(true);
        }}
        onSkip={() => setShowCameraPermission(false)}
        customTitle="Camera Access for Outfits"
        customSubtitle="Take photos of your daily outfits to track your style journey and get AI-powered recommendations."
      >
        <View />
      </PermissionWrapper>
    );
  }

  // Show gallery permission screen
  if (showGalleryPermission) {
    return (
      <PermissionWrapper
        requiredPermissions={['gallery']}
        onPermissionGranted={() => {
          setShowGalleryPermission(false);
          pickImageFromLibrary();
        }}
        onSkip={() => setShowGalleryPermission(false)}
        customTitle="Gallery Access for Outfits"
        customSubtitle="Choose from your existing photos to add to your outfit collection and style profile."
      >
        <View />
      </PermissionWrapper>
    );
  }

  if (showCamera) {
    return (
      <SafeAreaView style={styles.cameraContainer}>
        <StatusBar style="light" />
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.cameraButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={() => {
                if (cameraRef.current) {
                  takePicture(cameraRef.current);
                }
              }}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cameraButton}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.cameraButtonText}>Flip</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </SafeAreaView>
    );
  }

  // Generate outfit days based on actual OOTD data
  const generateOutfitDays = () => {
    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0];
    const days = [];

    for (let i = 4; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const dateString = date.toISOString().split('T')[0];
      const ootd = getOOTDForDate(dateString);

      days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate().toString().padStart(2, '0'),
        dateString,
        isToday: dateString === todayDateString,
        hasOutfit: !!ootd,
        ootd,
      });
    }

    return days;
  };

  const outfitDays = generateOutfitDays();

  // Calculate OOTD streak
  const calculateOOTDStreak = () => {
    if (userOOTDs.length === 0) return 0;

    // Sort OOTDs by date (most recent first)
    const sortedOOTDs = [...userOOTDs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    // Check each day going backwards from today
    for (let i = 0; i < 365; i++) {
      // Max check 1 year
      const dateString = currentDate.toISOString().split('T')[0];
      const hasOOTDForDate = sortedOOTDs.some(
        (ootd) => ootd.date === dateString
      );

      if (hasOOTDForDate) {
        streak++;
      } else {
        // If we haven't found any OOTDs yet, keep looking (maybe they started yesterday)
        if (streak === 0 && i === 0) {
          // Today doesn't have an OOTD, check yesterday
          currentDate.setDate(currentDate.getDate() - 1);
          continue;
        }
        // Break the streak if we find a day without an OOTD
        break;
      }

      // Move to previous day
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  };

  const currentStreak = calculateOOTDStreak();

  // Calculate items worn this month
  const calculateItemsWornThisMonth = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return userOOTDs.filter((ootd) => {
      const ootdDate = new Date(ootd.date);
      return (
        ootdDate.getMonth() === currentMonth &&
        ootdDate.getFullYear() === currentYear
      );
    }).length;
  };

  const itemsWornThisMonth = calculateItemsWornThisMonth();
  const CLOSET_SIZE_ESTIMATE = 30; // placeholder for "closet size" until we have real data
  const closetWornPercent = Math.min(
    100,
    Math.round((itemsWornThisMonth / CLOSET_SIZE_ESTIMATE) * 100)
  );

  const topStyles = getTopStyles(3);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={true}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Good Morning {currentUser.name.split(' ')[0]}!
          </Text>
          <Text style={styles.subtitle}>Keep your streaks going strong</Text>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.dayStreakCard}>
              <Text style={styles.statNumber}>{currentStreak}</Text>
              <Text style={styles.statLabel}>day OOTD{'\n'}streak</Text>
              <Image
                source={require('@/assets/images/Intersect.png')}
                style={styles.iconImage}
              />
            </View>

            <View style={styles.topStylesCard}>
              <Text style={styles.statTitle}>My Top Styles</Text>
              {topStyles.length > 0 ? (
                topStyles.map((style, index) => (
                  <Text key={style} style={styles.styleItem}>
                    {index + 1}. {style}
                  </Text>
                ))
              ) : (
                <Text style={styles.styleItem}>No styles yet</Text>
              )}
              <Image
                source={require('@/assets/images/Intersect (1).png')}
                style={styles.iconImage}
              />
            </View>
          </View>

          <View style={styles.progressCard}>
            <Text style={styles.progressNumber}>{closetWornPercent}%</Text>
            <Text style={styles.progressLabel}>
              of your{'\n'}closet worn{'\n'}this month
            </Text>

            <View style={styles.progressContainer}></View>

            <View style={styles.chartContainer}>
              <View style={[styles.chartBarFilled, { flex: closetWornPercent }]} />
              <View style={[styles.chartBar, { flex: Math.max(0, 100 - closetWornPercent) }]} />
            </View>
          </View>
        </View>

        <View style={styles.pageIndicator}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
        </View>

        {/* Outfit of the Week */}
        <View style={styles.outfitSectionWrapper}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                {currentUser.name.split(' ')[0]}'s Outfit of the Week
              </Text>
              <Text style={styles.sectionDate}>
                {new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>
            <TouchableOpacity style={styles.calendarButton}>
              <Calendar size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.calendarContainer}>
            {outfitDays.map((day, index) => (
              <View key={index} style={styles.dayContainer}>
                {/* Active day indicator dot */}
                <View style={styles.dayIndicatorContainer}>
                  {day.isToday && <View style={styles.activeDayDot} />}
                </View>

                <Text
                  style={[
                    styles.dayNumber,
                    day.isToday && styles.currentDayNumber,
                  ]}
                >
                  {day.date}
                </Text>
                <Text
                  style={[styles.dayName, day.isToday && styles.currentDayName]}
                >
                  {day.day}
                </Text>

                {day.hasOutfit ? (
                  <TouchableOpacity
                    style={styles.outfitImageContainer}
                    onLongPress={() => handleLongPressOOTD(day)}
                    delayLongPress={500}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={
                        typeof day.ootd?.imageUri === 'string'
                          ? { uri: day.ootd.imageUri }
                          : day.ootd?.imageUri
                      }
                      style={styles.backgroundImage}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.addOutfitButton}
                    onPress={handleAddOutfit}
                  >
                    <Image
                      source={require('@/assets/images/Group 32 (1).png')}
                      style={styles.addButtonImage}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Logo Teaser */}
        <Animated.View
          style={[
            styles.logoTeaser,
            {
              opacity: logoOpacity,
              transform: [{ translateY: logoTranslateY }],
            },
          ]}
        >
          <Image
            source={require('@/assets/images/image copy.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>identifit</Text>
          <Text style={styles.logoTagline}>Your style, identified</Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.xl,
    paddingBottom: size.touch,
  },
  header: {
    marginBottom: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  greeting: {
    fontSize: fontSize.sm,
    fontFamily: 'Helvetica Neue',
    color: '#C0D1FF',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.xxl,
    fontFamily: 'Caladea-Regular',
    color: '#ffffff',
  },
  statsContainer: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(63, 63, 63, 0.25)',
    borderRadius: radius.md,
    padding: spacing.xl,
    position: 'relative',
  },
  dayStreakCard: {
    flex: 1,
    backgroundColor: 'rgba(63, 63, 63, 0.25)',
    borderRadius: radius.md,
    padding: spacing.xl,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(244, 173, 179, 0.25)',
  },
  topStylesCard: {
    flex: 1,
    backgroundColor: 'rgba(63, 63, 63, 0.25)',
    borderRadius: radius.md,
    padding: spacing.xl,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(235, 252, 183, 0.25)',
  },
  statNumber: {
    fontSize: fontSize.xxl,
    color: '#E5ADFE',
    fontFamily: 'Caladea-Bold',
  },
  statLabel: {
    fontSize: fontSize.xs,
    fontFamily: 'Helvetica Neue',
    color: '#9CA3AF',
    lineHeight: fontSize.md,
  },
  statTitle: {
    fontSize: fontSize.xl,
    color: '#EBFCB7',
    fontFamily: 'Caladea-Bold',
    fontWeight: 'Bold',
  },
  styleItem: {
    fontSize: fontSize.xs,
    fontFamily: 'Helvetica Neue',
    color: '#9CA3AF',
  },
  iconImage: {
    width: size.touch,
    height: size.touch,
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    resizeMode: 'contain',
  },
  progressCard: {
    backgroundColor: 'rgba(63, 63, 63, 0.25)',
    borderRadius: radius.md,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(168, 198, 255, 0.25)',
  },
  progressNumber: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    fontFamily: 'Caladea-Bold',
    color: '#A8C6FF',
    marginRight: spacing.lg,
  },
  progressLabel: {
    fontSize: fontSize.xs,
    fontFamily: 'Helvetica Neue',
    color: '#9CA3AF',
    lineHeight: fontSize.md,
    flex: 1,
  },
  progressContainer: {
    flex: 1,
    marginLeft: spacing.xl,
  },
  progressBarsContainer: {
    flexDirection: 'row',
    height: size.touch,
  },
  progressTextGray: {
    fontSize: fontSize.caption,
    fontFamily: 'Helvetica Neue',
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
  },
  pageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginVertical: spacing.sm,
  },
  dot: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: radius.xs,
    backgroundColor: '#595959',
  },
  activeDot: {
    backgroundColor: '#C0D1FF',
  },
  outfitSectionWrapper: {
    backgroundColor: 'rgba(63, 63, 63, 0.25)',
    borderTopLeftRadius: radius.round,
    borderTopRightRadius: radius.round,
    padding: spacing.xl,
    marginTop: spacing.xl,
    borderColor: 'rgba(194, 194, 194, 0.4)',
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '400',
    fontFamily: 'Caladea-Regular',
    color: '#ffffff',
  },
  sectionDate: {
    marginTop: spacing.sm,
    fontSize: fontSize.xs,
    fontWeight: '400',
    fontFamily: 'Helvetica Neue',
    color: '#C0D1FF',
  },
  calendarButton: {
    width: size.touch,
    height: size.touch,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayContainer: {
    alignItems: 'center',
    flex: 1,
  },
  dayIndicatorContainer: {
    height: size.iconSm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  activeDayDot: {
    width: size.handleHeight,
    height: size.handleHeight,
    borderRadius: radius.xs,
    backgroundColor: '#C0D1FF',
  },
  dayNumber: {
    fontSize: fontSize.xs,
    fontWeight: '400',
    fontFamily: 'Helvetica Neue',
    color: '#ffffff',
    marginBottom: spacing.xs,
  },
  dayName: {
    fontSize: fontSize.xs,
    fontFamily: 'Helvetica Neue',
    color: '#FFFFFF',
    marginBottom: spacing.lg,
  },
  currentDayNumber: {
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(255, 255, 255, 0.25)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  currentDayName: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(255, 255, 255, 0.25)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  outfitImageContainer: {
    width: size.outfitStripWidth,
    height: size.outfitStripHeight,
    borderRadius: radius.roundLg,
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  outfitImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  addOutfitButton: {
    width: size.outfitStripWidth,
    height: size.outfitStripHeight,
    borderRadius: radius.roundLg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonImage: {
    width: size.iconXs,
    height: size.iconXs,
    resizeMode: 'contain',
  },
  logoTeaser: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
  },
  logoImage: {
    width: size.avatarSm,
    height: size.avatarSm,
    marginBottom: spacing.lg,
    opacity: 0.6,
  },
  logoText: {
    fontSize: fontSize.md,
    fontFamily: 'Caladea-Regular',
    color: '#C0D1FF',
    opacity: 0.8,
    marginBottom: spacing.xs,
  },
  logoTagline: {
    fontSize: fontSize.xs,
    fontFamily: 'WorkSans-Regular',
    color: '#9CA3AF',
    opacity: 0.7,
    fontStyle: 'italic',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: spacing.sm,
    borderRadius: radius.xs,
    overflow: 'hidden',
    flex: 1,
    marginLeft: spacing.sm,
  },
  chartBar: {
    backgroundColor: 'rgba(168, 198, 255, 0.2)',
  },
  chartBarFilled: {
    backgroundColor: '#A8C6FF',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: size.touch,
    paddingBottom: size.avatarSm,
  },
  cameraButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: radius.roundLg,
  },
  cameraButtonText: {
    color: '#ffffff',
    fontSize: fontSize.base,
    fontWeight: '500',
  },
  captureButton: {
    width: size.avatarLg,
    height: size.avatarLg,
    borderRadius: size.touch,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: spacing.xs,
    borderColor: '#ffffff',
  },
  captureButtonInner: {
    width: size.avatarSm,
    height: size.avatarSm,
    borderRadius: size.touchLg,
    backgroundColor: '#ffffff',
  },
});
