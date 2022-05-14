import { defineStore } from "pinia";
import { useAuthStore } from "../stores/auth";
import { supabase } from "@/supabase";

export const useTweetStore = defineStore({
  id: "tweets",
  state: () => ({
    tweets: [],
    profileTweets: [],
    userLikedTweets: [],
    followingIds: [],
  }),
  getters: {
    allTweets: (state) => {
      const tweetsCopy = JSON.parse(JSON.stringify(state.tweets));
      return tweetsCopy.map((tweet) => {
        tweet.liked = state.userLikedTweets.includes(tweet.id);
        return tweet;
      });
    },
  },
  actions: {
    async getFollowing() {
      try {
        const authStore = useAuthStore();

        if (!authStore.isAuthenticated) return;

        const { data: following, error: followsError } = await supabase
          .from("follows")
          .select("following_id")
          .eq("follower_id", authStore.user.id);

        if (followsError) throw followsError;

        this.followingIds = following.map((id) => id.following_id);
      } catch (error) {
        console.error(error);
      }
    },
    async getTweets() {
      try {
        await this.getFollowing();

        const { data, error } = await supabase
          .from("tweets")
          .select("*, profiles( * )")
          .in("user_id", this.followingIds)
          .order("created_at", { ascending: false });

        if (error) throw error;

        this.tweets = data;
      } catch (error) {
        console.error(error);
      }
    },
    async getProfileTweets(username) {
      try {
        const { data, error } = await supabase
          .from("tweets")
          .select("*, profiles!inner(*)")
          .eq("profiles.username", username)
          .order("created_at", { ascending: false });

        if (error) throw error;

        this.profileTweets = data;
      } catch (error) {
        console.error(error);
      }
    },
    async getUserLikedTweets() {
      try {
        const authStore = useAuthStore();

        if (!authStore.isAuthenticated) return;

        const { data, error } = await supabase
          .from("liked_tweets")
          .select("tweet_id")
          .eq("user_id", authStore.user.id);

        if (error) throw error;

        this.userLikedTweets = data.map((t) => t.tweet_id);
      } catch (error) {
        console.error(error.message);
      }
    },
    async getTweetById(id) {
      try {
        const { data, error } = await supabase
          .from("tweets")
          .select("*, profiles( * )")
          .eq("id", id)
          .single();

        if (error) throw error;

        this.tweets.unshift(data);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
