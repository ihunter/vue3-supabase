import { defineStore } from "pinia";
import { useAuthStore } from "../stores/auth";
import { supabase } from "@/supabase";

export const useTweetStore = defineStore({
  id: "tweets",
  state: () => ({
    tweets: [],
    userLikedTweets: [],
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
    async getTweets() {
      try {
        const { data, error } = await supabase
          .from("tweets")
          .select("*, profiles( * )")
          .order("created_at", { ascending: false });

        if (error) throw error;

        this.tweets = data;
      } catch (error) {
        console.error(error);
      }
    },
    async getUserLikedTweets() {
      try {
        const authStore = useAuthStore();
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
