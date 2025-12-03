'use client';

import { useState, useEffect } from 'react';
import { Globe, MapPin, Heart, MessageSquare, Share2, MoreHorizontal, Star, Filter, Search, Plus, Bookmark } from 'lucide-react';

type Post = {
  id: string;
  username: string;
  avatar: string;
  location: string;
  distance: string;
  timeAgo: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  rating?: number;
  tags: string[];
  isLiked: boolean;
  isSaved: boolean;
};

type FilterOption = 'all' | 'food' | 'attractions' | 'tips' | 'events';

const LocalFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockPosts: Post[] = [
      {
        id: '1',
        username: 'traveler_jane',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        location: 'Prague Castle',
        distance: '2.3 km away',
        timeAgo: '2h ago',
        content: 'The view from the castle is absolutely breathtaking! Make sure to visit early to avoid the crowds. The gardens are also worth exploring.',
        image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        likes: 24,
        comments: 8,
        rating: 5,
        tags: ['attractions', 'views', 'history'],
        isLiked: false,
        isSaved: false
      },
      {
        id: '2',
        username: 'foodie_mike',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        location: 'U Fleků',
        distance: '1.1 km away',
        timeAgo: '5h ago',
        content: 'Best traditional Czech food in town! Their goulash and dumplings are to die for. The dark beer is brewed on-site and is a must-try.',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        likes: 42,
        comments: 12,
        rating: 5,
        tags: ['food', 'restaurant', 'local'],
        isLiked: true,
        isSaved: true
      },
      {
        id: '3',
        username: 'adventurer_sam',
        avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
        location: 'Charles Bridge',
        distance: '0.5 km away',
        timeAgo: '1d ago',
        content: 'Pro tip: Visit at sunrise for the most magical experience without the crowds. The morning light on the statues is incredible.',
        likes: 18,
        comments: 3,
        rating: 4,
        tags: ['tips', 'photography', 'sunrise'],
        isLiked: false,
        isSaved: false
      },
      {
        id: '4',
        username: 'culture_vulture',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        location: 'Prague National Theatre',
        distance: '3.2 km away',
        timeAgo: '1d ago',
        content: 'The opera last night was spectacular! Even if you\'re not into classical music, the building itself is a masterpiece of neo-Renaissance architecture.',
        image: 'https://images.unsplash.com/photo-1505376389276-db143e56fa0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        likes: 31,
        comments: 7,
        rating: 5,
        tags: ['culture', 'events', 'theater'],
        isLiked: true,
        isSaved: true
      },
      {
        id: '5',
        username: 'backpacker_leo',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        location: 'Petřín Hill',
        distance: '1.8 km away',
        timeAgo: '2d ago',
        content: 'Hiked up Petřín Hill today - the view of the city is worth every step! There\'s also a funicular if you prefer not to walk.',
        image: 'https://images.unsplash.com/photo-1541802645635-11f2286a7482?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        likes: 56,
        comments: 14,
        rating: 4,
        tags: ['hiking', 'views', 'nature'],
        isLiked: false,
        isSaved: false
      }
    ];

    // Simulate API call
    const timer = setTimeout(() => {
      setPosts(mockPosts);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          } 
        : post
    ));
  };

  const handleSave = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved } 
        : post
    ));
  };

  const filterOptions: {id: FilterOption; label: string}[] = [
    { id: 'all', label: 'All' },
    { id: 'food', label: 'Food & Drinks' },
    { id: 'attractions', label: 'Attractions' },
    { id: 'tips', label: 'Local Tips' },
    { id: 'events', label: 'Events' },
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'food' && post.tags.includes('food')) ||
                         (activeFilter === 'attractions' && post.tags.includes('attractions')) ||
                         (activeFilter === 'tips' && post.tags.includes('tips')) ||
                         (activeFilter === 'events' && post.tags.includes('events'));
    
    return matchesSearch && matchesFilter;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Globe className="h-6 w-6 mr-2 text-blue-600" />
            Local Feed
          </h1>
        </div>
        
        {/* Loading Skeletons */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 animate-pulse">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
              <div className="ml-3">
                <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                <div className="h-3 bg-gray-100 rounded w-24"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-48 bg-gray-100 rounded-md"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Globe className="h-6 w-6 mr-2 text-blue-600" />
          Local Feed
        </h1>
        <button className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search for places, tips, or users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4">
        {filterOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setActiveFilter(option.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              activeFilter === option.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <Globe className="h-12 w-12 mx-auto text-gray-300" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No posts found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery 
              ? 'Try a different search term or filter.'
              : 'Be the first to share your local insights!'}
          </p>
          <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Create Post
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Post Header */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      className="h-10 w-10 rounded-full object-cover" 
                      src={post.avatar} 
                      alt={post.username} 
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{post.username}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{post.location}</span>
                        <span className="mx-1">•</span>
                        <span>{post.distance}</span>
                        <span className="mx-1">•</span>
                        <span>{post.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-500">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Post Content */}
                <p className="mt-3 text-gray-700">{post.content}</p>
                
                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Rating */}
                {post.rating && (
                  <div className="mt-3 flex items-center">
                    {renderStars(post.rating)}
                    <span className="ml-2 text-sm text-gray-500">{post.rating}.0</span>
                  </div>
                )}
              </div>
              
              {/* Post Image */}
              {post.image && (
                <div className="w-full h-64 bg-gray-100 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.location} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Post Actions */}
              <div className="px-4 py-3 border-t border-gray-100">
                <div className="flex justify-between">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-1 ${post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Heart className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                    <MessageSquare className="h-5 w-5" />
                    <span>{post.comments}</span>
                  </button>
                  
                  <button className="text-gray-500 hover:text-gray-700">
                    <Share2 className="h-5 w-5" />
                  </button>
                  
                  <button 
                    onClick={() => handleSave(post.id)}
                    className={`${post.isSaved ? 'text-yellow-500' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Bookmark className={`h-5 w-5 ${post.isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Create Post Button (Mobile) */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button className="p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default LocalFeed;
