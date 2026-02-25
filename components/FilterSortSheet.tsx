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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    paddingVertical: 12,
  },
  handle: {
    width: 36,
    height: 5,
    backgroundColor: '#3A3A3C',
    borderRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Caladea-Bold',
    color: '#FFFFFF',
  },
  resetText: {
    fontSize: 15,
    fontFamily: 'Helvetica Neue',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 48,
    gap: 12,
  },
  filterOption: {
    flex: 1,
    alignItems: 'center',
  },
  filterButton: {
    width: 103,
    height: 100,
    backgroundColor: '#595959',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  selectedFilter: {
    backgroundColor: '#C0D1FF',
  },
  seasonEmoji: {
    fontSize: 32,
  },
  bodyTypeIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFFFFF',
  },
  locationEmoji: {
    fontSize: 32,
  },
  filterText: {
    fontSize: 12,
    fontFamily: 'Helvetica Neue',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 14,
  },
  comfortabilitySection: {
    marginBottom: 48,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Caladea-Bold',
    color: '#FFFFFF',
    marginBottom: 32,
  },
  sliderContainer: {
    marginBottom: 24,
    position: 'relative',
    height: 60,
    justifyContent: 'center',
  },
  sliderBackground: {
    position: 'absolute',
    width: '100%',
    height: 60,
    left: 0,
    right: 0,
  },
  sliderBackgroundImage: {
    resizeMode: 'stretch',
    borderRadius: 30,
  },
  slider: {
    width: '100%',
    height: 40,
    zIndex: 1,
  },
  sliderThumb: {
    backgroundColor: '#FFFFFF',
    width: 24,
    height: 24,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labelEmoji: {
    fontSize: 22,
  },
  labelText: {
    fontSize: 14,
    fontFamily: 'WorkSans-Regular',
    color: '#FFFFFF',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 34,
    paddingTop: 20,
  },
  applyButton: {
    backgroundColor: '#A8B3FF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: 'Helvetica Neue',
    color: '#000000',
  },
});