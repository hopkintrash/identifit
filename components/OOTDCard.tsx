import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { Heart, Clock, Lock } from 'lucide-react-native';
import { OOTD, User } from '@/types/ootd';
import { spacing, fontSize, size, radius } from '@/lib/theme';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

interface OOTDCardProps {
  ootd: OOTD;
  user: User;
  onLike: (ootdId: string) => void;
  onPress?: () => void;
  showUser?: boolean;
}

export default function OOTDCard({
  ootd,
  user,
  onLike,
  onPress,
  showUser = true,
}: OOTDCardProps) {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getWeatherIcon = (weather?: string) => {
    const icons: Record<string, string> = {
      sunny: '☀️',
      cloudy: '☁️',
      rainy: '🌧️',
      snowy: '❄️',
      windy: '💨',
      hot: '🔥',
    };
    return weather ? icons[weather] : '';
  };

  const getOccasionIcon = (occasion?: string) => {
    const icons: Record<string, string> = {
      work: '💼',
      school: '🎓',
      date: '💕',
      party: '🎉',
      casual: '☕',
      workout: '💪',
      travel: '✈️',
      formal: '🎭',
      outdoor: '🌲',
      shopping: '🛍️',
    };
    return occasion ? icons[occasion] : '';
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* User Header */}
      {showUser && (
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Image 
                source={typeof user.avatar === 'string' ? { uri: user.avatar } : require('@/assets/images/image.png')} 
                style={styles.avatar} 
              />
              {user.isOnline && <View style={styles.onlineIndicator} />}
            </View>
            <Text style={styles.userName}>{user.name}</Text>
          </View>
          
          <View style={styles.timeContainer}>
            <Clock size={12} color="#6B7280" />
            <Text style={styles.timeText}>{formatTimeAgo(ootd.createdAt)}</Text>
          </View>
        </View>
      )}

      {/* OOTD Image */}
      <View style={styles.ootdContainer}>
        <Image 
          source={typeof ootd.imageUri === 'string' ? { uri: ootd.imageUri } : ootd.imageUri}
          style={styles.ootdImage}
          resizeMode="cover"
        />
        
        {/* Overlay Info */}
        <View style={styles.overlayInfo}>
          {ootd.isPrivate && (
            <View style={styles.privateBadge}>
              <Lock size={12} color="#ffffff" />
            </View>
          )}
          {ootd.weather && (
            <View style={styles.weatherBadge}>
              <Text style={styles.weatherIcon}>{getWeatherIcon(ootd.weather)}</Text>
            </View>
          )}
          {ootd.occasion && (
            <View style={styles.occasionBadge}>
              <Text style={styles.occasionIcon}>{getOccasionIcon(ootd.occasion)}</Text>
            </View>
          )}
        </View>

        {/* Date Badge */}
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{formatDate(ootd.date)}</Text>
        </View>
      </View>

      {/* Like Section */}
      <View style={styles.likeSection}>
        <TouchableOpacity
          style={styles.likeButton}
          onPress={() => onLike(ootd.id)}
          activeOpacity={0.7}
        >
          <Heart 
            size={20} 
            color={ootd.isLiked ? "#EF4444" : "#9CA3AF"} 
            fill={ootd.isLiked ? "#EF4444" : "transparent"}
          />
        </TouchableOpacity>
        
        <Text style={styles.likesCount}>
          {ootd.likes > 0 ? ootd.likes : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    backgroundColor: '#2C2C2E',
    borderRadius: radius.xxl,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.sm,
  },
  avatar: {
    width: size.iconLg,
    height: size.iconLg,
    borderRadius: radius.xl,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: size.iconSm,
    height: size.iconSm,
    borderRadius: radius.sm,
    backgroundColor: '#4ADE80',
    borderWidth: 2,
    borderColor: '#2C2C2E',
  },
  userName: {
    fontSize: fontSize.sm,
    fontFamily: 'WorkSans-SemiBold',
    color: '#FFFFFF',
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  timeText: {
    fontSize: fontSize.caption,
    fontFamily: 'WorkSans-Regular',
    color: '#6B7280',
  },
  ootdContainer: {
    position: 'relative',
    aspectRatio: 3/4,
  },
  ootdImage: {
    width: '100%',
    height: '100%',
  },
  overlayInfo: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    gap: spacing.xs,
  },
  privateBadge: {
    width: size.iconMd,
    height: size.iconMd,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherBadge: {
    width: size.iconMd,
    height: size.iconMd,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherIcon: {
    fontSize: fontSize.xs,
  },
  occasionBadge: {
    width: size.iconMd,
    height: size.iconMd,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(168, 179, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  occasionIcon: {
    fontSize: fontSize.xs,
  },
  dateBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  dateText: {
    fontSize: fontSize.caption,
    fontFamily: 'WorkSans-Medium',
    color: '#FFFFFF',
  },
  likeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  likeButton: {
    padding: spacing.xs,
  },
  likesCount: {
    fontSize: fontSize.sm,
    fontFamily: 'WorkSans-Medium',
    color: '#9CA3AF',
    minWidth: size.iconSm,
    textAlign: 'right',
  },
});