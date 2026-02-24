import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  Animated,
  Dimensions,
  PanResponder,
  TouchableWithoutFeedback,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useFonts, Caladea_400Regular, Caladea_700Bold } from '@expo-google-fonts/caladea';
import { WorkSans_400Regular, WorkSans_500Medium, WorkSans_600SemiBold } from '@expo-google-fonts/work-sans';
import { spacing, fontSize, size, radius } from '@/lib/theme';

interface FilterSortSheetProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
}

interface FilterState {
  season: 'spring' | 'summer' | 'fall' | 'winter' | null;
  bodyType: 'hourglass' | 'triangle' | 'rectangle' | 'oval' | 'heart' | null;
  showNearMe: boolean;
  comfortability: number;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.85;
const SHEET_MIN_HEIGHT = SCREEN_HEIGHT * 0.5;

export default function FilterSortSheet({
  visible,
  onClose,
  onApplyFilters,
}: FilterSortSheetProps) {
  const [filters, setFilters] = useState<FilterState>({
    season: null,
    bodyType: null,
    showNearMe: false,
    comfortability: 0.5,
  });

  const translateY = useRef(new Animated.Value(SHEET_MAX_HEIGHT)).current;
  const lastGestureDy = useRef(0);
  const [showButton, setShowButton] = useState(false);

  const [fontsLoaded] = useFonts({
    'Caladea-Regular': Caladea_400Regular,
    'Caladea-Bold': Caladea_700Bold,
    'WorkSans-Regular': WorkSans_400Regular,
    'WorkSans-Medium': WorkSans_500Medium,
    'WorkSans-SemiBold': WorkSans_600SemiBold,
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dy } = gestureState;
        return Math.abs(dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        const { dy } = gestureState;
        if (dy > 0) {
          translateY.setValue(dy);
        } else if (dy < -20) {
          setShowButton(true);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dy, vy } = gestureState;
        if (dy > 100 || vy > 0.5) {
          closeSheet();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 50,
            stiffness: 300,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      setShowButton(false);
      translateY.setValue(SHEET_MAX_HEIGHT);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 50,
        stiffness: 300,
      }).start();
    }
  }, [visible]);

  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: SHEET_MAX_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleReset = () => {
    setFilters({
      season: null,
      bodyType: null,
      showNearMe: false,
      comfortability: 0.5,
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    closeSheet();
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={closeSheet}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={closeSheet}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sheetContainer,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <SafeAreaView style={styles.container}>
            {/* Drag Handle */}
            <View {...panResponder.panHandlers} style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Filter & Sort</Text>
              <TouchableOpacity onPress={handleReset}>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
            </View>

        <View style={styles.content}>
          {/* Filter Options */}
          <View style={styles.filterRow}>
            {/* Season Filter */}
            <View style={styles.filterOption}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  filters.season === 'summer' && styles.selectedFilter,
                ]}
                onPress={() => updateFilter('season',
                  filters.season === 'summer' ? null : 'summer'
                )}
              >
                <Text style={styles.seasonEmoji}>🏖️</Text>
              </TouchableOpacity>
              <Text style={styles.filterText}>
                Season: Summer
              </Text>
            </View>

            {/* Body Type Filter */}
            <View style={styles.filterOption}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  filters.bodyType && styles.selectedFilter,
                ]}
                onPress={() => updateFilter('bodyType',
                  filters.bodyType ? null : 'hourglass'
                )}
              >
                <View style={styles.bodyTypeIcon}>
                  <View style={styles.triangle} />
                </View>
              </TouchableOpacity>
              <Text style={styles.filterText}>
                Body Type
              </Text>
            </View>

            {/* Location Filter */}
            <View style={styles.filterOption}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  filters.showNearMe && styles.selectedFilter,
                ]}
                onPress={() => updateFilter('showNearMe', !filters.showNearMe)}
              >
                <Text style={styles.locationEmoji}>📍</Text>
              </TouchableOpacity>
              <Text style={styles.filterText}>
                Show Posts Near Me
              </Text>
            </View>
          </View>

          {/* Comfortability Scale */}
          <View style={styles.comfortabilitySection}>
            <Text style={styles.sectionTitle}>Comfortability Scale</Text>

            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={filters.comfortability}
                onValueChange={(value) => updateFilter('comfortability', value)}
                minimumTrackTintColor="transparent"
                maximumTrackTintColor="transparent"
                thumbStyle={styles.sliderThumb}
              />
            </View>

            <View style={styles.sliderLabels}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelEmoji}>🧑‍💼</Text>
                <Text style={styles.labelText}>Less Comfy</Text>
              </View>
              <View style={styles.labelContainer}>
                <Text style={styles.labelEmoji}>🛋️</Text>
                <Text style={styles.labelText}>Most Comfy</Text>
              </View>
            </View>
          </View>
        </View>

            {/* Apply Button */}
            {showButton && (
              <View style={styles.footer}>
                <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                  <Text style={styles.applyButtonText}>Show 348 Results</Text>
                </TouchableOpacity>
              </View>
            )}
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheetContainer: {
    backgroundColor: '#000000',
    borderTopLeftRadius: radius.round,
    borderTopRightRadius: radius.round,
    maxHeight: SHEET_MAX_HEIGHT,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  container: {
    backgroundColor: '#000000',
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  handle: {
    width: size.handleWidth,
    height: size.handleHeight,
    backgroundColor: '#3A3A3C',
    borderRadius: radius.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontFamily: 'Caladea-Bold',
    color: '#FFFFFF',
  },
  resetText: {
    fontSize: fontSize.base,
    fontFamily: 'Helvetica Neue',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxxl,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: size.touchLg,
    gap: spacing.lg,
  },
  filterOption: {
    flex: 1,
    alignItems: 'center',
  },
  filterButton: {
    width: size.filterTile,
    height: size.filterTile,
    backgroundColor: '#595959',
    borderRadius: radius.roundLg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  selectedFilter: {
    backgroundColor: '#C0D1FF',
  },
  seasonEmoji: {
    fontSize: fontSize.xxxl,
  },
  bodyTypeIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: spacing.lg,
    borderRightWidth: spacing.lg,
    borderBottomWidth: spacing.xl,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFFFFF',
  },
  locationEmoji: {
    fontSize: fontSize.xxxl,
  },
  filterText: {
    fontSize: fontSize.xs,
    fontFamily: 'Helvetica Neue',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: fontSize.sm,
  },
  comfortabilitySection: {
    marginBottom: size.touchLg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontFamily: 'Caladea-Bold',
    color: '#FFFFFF',
    marginBottom: spacing.xxxl,
  },
  sliderContainer: {
    marginBottom: spacing.xxl,
    position: 'relative',
    height: size.avatarSm,
    justifyContent: 'center',
  },
  sliderBackground: {
    position: 'absolute',
    width: '100%',
    height: size.avatarSm,
    left: 0,
    right: 0,
  },
  sliderBackgroundImage: {
    resizeMode: 'stretch',
    borderRadius: radius.roundLg,
  },
  slider: {
    width: '100%',
    height: size.touch,
    zIndex: 1,
  },
  sliderThumb: {
    backgroundColor: '#FFFFFF',
    width: size.iconMd,
    height: size.iconMd,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  labelEmoji: {
    fontSize: fontSize.xl,
  },
  labelText: {
    fontSize: fontSize.sm,
    fontFamily: 'WorkSans-Regular',
    color: '#FFFFFF',
  },
  footer: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.xl,
  },
  applyButton: {
    backgroundColor: '#A8B3FF',
    borderRadius: radius.xxl,
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: fontSize.base,
    fontFamily: 'Helvetica Neue',
    color: '#000000',
  },
});