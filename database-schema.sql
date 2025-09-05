-- Pocket Parley Database Schema for Supabase
-- This file contains the complete database schema for the Pocket Parley application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    subscription_status VARCHAR(20) DEFAULT 'free' CHECK (subscription_status IN ('free', 'basic', 'premium')),
    stripe_customer_id VARCHAR(255),
    subscription_id VARCHAR(255),
    subscription_end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trusted contacts table
CREATE TABLE public.trusted_contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(user_id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    relationship VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interaction logs table
CREATE TABLE public.interaction_logs (
    log_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(user_id) ON DELETE CASCADE NOT NULL,
    interaction_type VARCHAR(50) NOT NULL CHECK (interaction_type IN ('traffic_stop', 'detention', 'arrest', 'questioning', 'other')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    location_city VARCHAR(255),
    location_state VARCHAR(100),
    location_address TEXT,
    recording_url TEXT,
    notes TEXT,
    shared_summary_url TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
    rights_exercised TEXT[], -- Array of rights that were exercised
    officer_badge_numbers TEXT[], -- Array of officer badge numbers if available
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rights guides cache table (for caching AI-generated content)
CREATE TABLE public.rights_guides (
    guide_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    state VARCHAR(100) NOT NULL,
    interaction_type VARCHAR(50) NOT NULL CHECK (interaction_type IN ('traffic_stop', 'detention', 'arrest', 'questioning', 'other')),
    language VARCHAR(5) DEFAULT 'en' CHECK (language IN ('en', 'es')),
    content JSONB NOT NULL, -- Stores the rights content (dos, donts, summary, detailedInfo)
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(state, interaction_type, language)
);

-- Scripts cache table (for caching AI-generated scripts)
CREATE TABLE public.scripts (
    script_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    scenario VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    language VARCHAR(5) DEFAULT 'en' CHECK (language IN ('en', 'es')),
    scripts JSONB NOT NULL, -- Array of script objects
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(scenario, state, language)
);

-- User preferences table
CREATE TABLE public.user_preferences (
    user_id UUID REFERENCES public.users(user_id) ON DELETE CASCADE PRIMARY KEY,
    language VARCHAR(5) DEFAULT 'en' CHECK (language IN ('en', 'es')),
    theme VARCHAR(10) DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
    notifications_enabled BOOLEAN DEFAULT TRUE,
    location_sharing_enabled BOOLEAN DEFAULT TRUE,
    auto_record_enabled BOOLEAN DEFAULT FALSE,
    emergency_contacts_alert BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interaction summaries table (for shared summaries)
CREATE TABLE public.interaction_summaries (
    summary_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    log_id UUID REFERENCES public.interaction_logs(log_id) ON DELETE CASCADE NOT NULL,
    summary_text TEXT NOT NULL,
    language VARCHAR(5) DEFAULT 'en' CHECK (language IN ('en', 'es')),
    share_token VARCHAR(255) UNIQUE, -- For public sharing
    is_public BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency alerts table (for trusted contact notifications)
CREATE TABLE public.emergency_alerts (
    alert_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(user_id) ON DELETE CASCADE NOT NULL,
    log_id UUID REFERENCES public.interaction_logs(log_id) ON DELETE CASCADE,
    contact_id UUID REFERENCES public.trusted_contacts(id) ON DELETE CASCADE NOT NULL,
    alert_type VARCHAR(50) DEFAULT 'interaction_started' CHECK (alert_type IN ('interaction_started', 'emergency', 'location_update')),
    message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivery_status VARCHAR(20) DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_subscription_status ON public.users(subscription_status);
CREATE INDEX idx_users_stripe_customer_id ON public.users(stripe_customer_id);
CREATE INDEX idx_trusted_contacts_user_id ON public.trusted_contacts(user_id);
CREATE INDEX idx_interaction_logs_user_id ON public.interaction_logs(user_id);
CREATE INDEX idx_interaction_logs_timestamp ON public.interaction_logs(timestamp DESC);
CREATE INDEX idx_interaction_logs_type ON public.interaction_logs(interaction_type);
CREATE INDEX idx_interaction_logs_location ON public.interaction_logs(location_state, location_city);
CREATE INDEX idx_rights_guides_lookup ON public.rights_guides(state, interaction_type, language);
CREATE INDEX idx_scripts_lookup ON public.scripts(scenario, state, language);
CREATE INDEX idx_interaction_summaries_token ON public.interaction_summaries(share_token);
CREATE INDEX idx_emergency_alerts_user_id ON public.emergency_alerts(user_id);
CREATE INDEX idx_emergency_alerts_status ON public.emergency_alerts(delivery_status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trusted_contacts_updated_at BEFORE UPDATE ON public.trusted_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interaction_logs_updated_at BEFORE UPDATE ON public.interaction_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interaction_summaries_updated_at BEFORE UPDATE ON public.interaction_summaries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interaction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interaction_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_alerts ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trusted contacts policies
CREATE POLICY "Users can view own trusted contacts" ON public.trusted_contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own trusted contacts" ON public.trusted_contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own trusted contacts" ON public.trusted_contacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own trusted contacts" ON public.trusted_contacts FOR DELETE USING (auth.uid() = user_id);

-- Interaction logs policies
CREATE POLICY "Users can view own interaction logs" ON public.interaction_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interaction logs" ON public.interaction_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own interaction logs" ON public.interaction_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own interaction logs" ON public.interaction_logs FOR DELETE USING (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);

-- Interaction summaries policies
CREATE POLICY "Users can view own summaries" ON public.interaction_summaries FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.interaction_logs WHERE log_id = interaction_summaries.log_id)
);
CREATE POLICY "Users can insert own summaries" ON public.interaction_summaries FOR INSERT WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.interaction_logs WHERE log_id = interaction_summaries.log_id)
);
CREATE POLICY "Users can update own summaries" ON public.interaction_summaries FOR UPDATE USING (
    auth.uid() = (SELECT user_id FROM public.interaction_logs WHERE log_id = interaction_summaries.log_id)
);
CREATE POLICY "Public summaries are viewable" ON public.interaction_summaries FOR SELECT USING (is_public = true AND (expires_at IS NULL OR expires_at > NOW()));

-- Emergency alerts policies
CREATE POLICY "Users can view own alerts" ON public.emergency_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own alerts" ON public.emergency_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON public.emergency_alerts FOR UPDATE USING (auth.uid() = user_id);

-- Rights guides and scripts are publicly readable (cached content)
ALTER TABLE public.rights_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rights guides are publicly readable" ON public.rights_guides FOR SELECT TO authenticated USING (true);
CREATE POLICY "Scripts are publicly readable" ON public.scripts FOR SELECT TO authenticated USING (true);

-- Allow service role to manage cache tables
CREATE POLICY "Service role can manage rights guides" ON public.rights_guides FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage scripts" ON public.scripts FOR ALL TO service_role USING (true);

-- Storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('recordings', 'recordings', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('summaries', 'summaries', true);

-- Storage policies
CREATE POLICY "Users can upload own recordings" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'recordings' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view own recordings" ON storage.objects FOR SELECT USING (
    bucket_id = 'recordings' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own recordings" ON storage.objects FOR DELETE USING (
    bucket_id = 'recordings' AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public summaries are viewable" ON storage.objects FOR SELECT USING (
    bucket_id = 'summaries'
);

CREATE POLICY "Users can upload summaries" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'summaries' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Functions for common operations
CREATE OR REPLACE FUNCTION get_user_subscription_status(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    status TEXT;
BEGIN
    SELECT subscription_status INTO status
    FROM public.users
    WHERE user_id = user_uuid;
    
    RETURN COALESCE(status, 'free');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION create_user_profile(user_uuid UUID, user_email TEXT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.users (user_id, email, subscription_status)
    VALUES (user_uuid, user_email, 'free')
    ON CONFLICT (user_id) DO NOTHING;
    
    INSERT INTO public.user_preferences (user_id)
    VALUES (user_uuid)
    ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired summaries
CREATE OR REPLACE FUNCTION cleanup_expired_summaries()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.interaction_summaries
    WHERE expires_at IS NOT NULL AND expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get interaction statistics
CREATE OR REPLACE FUNCTION get_user_interaction_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    stats JSON;
BEGIN
    SELECT json_build_object(
        'total_interactions', COUNT(*),
        'interactions_by_type', json_object_agg(interaction_type, type_count),
        'recent_interactions', COUNT(*) FILTER (WHERE timestamp > NOW() - INTERVAL '30 days'),
        'states_visited', COUNT(DISTINCT location_state)
    ) INTO stats
    FROM (
        SELECT 
            interaction_type,
            timestamp,
            location_state,
            COUNT(*) OVER (PARTITION BY interaction_type) as type_count
        FROM public.interaction_logs
        WHERE user_id = user_uuid AND status = 'active'
    ) t;
    
    RETURN COALESCE(stats, '{}'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create user profile on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM create_user_profile(NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Sample data for development (optional)
-- Uncomment the following lines to insert sample data

/*
-- Sample rights guide
INSERT INTO public.rights_guides (state, interaction_type, language, content) VALUES
('California', 'traffic_stop', 'en', '{
    "dos": [
        "Keep your hands visible on the steering wheel",
        "Remain calm and speak respectfully",
        "Provide license, registration, and insurance when requested",
        "Follow lawful orders",
        "Remember details of the interaction"
    ],
    "donts": [
        "Don''t make sudden movements",
        "Don''t argue or become confrontational", 
        "Don''t consent to searches without a warrant",
        "Don''t lie or provide false information",
        "Don''t resist, even if you believe the stop is unlawful"
    ],
    "summary": "During a traffic stop in California, remain calm, keep hands visible, and comply with lawful orders while exercising your constitutional rights.",
    "detailedInfo": "In California, you have the right to remain silent beyond providing required identification. You can refuse consent to search your vehicle unless officers have probable cause or a warrant. California Vehicle Code requires you to provide license, registration, and proof of insurance upon request."
}'::jsonb);

-- Sample script
INSERT INTO public.scripts (scenario, state, language, scripts) VALUES
('Traffic Stop - Initial Contact', 'California', 'en', '[
    {
        "purpose": "When officer approaches your vehicle",
        "text": "Good [morning/afternoon/evening], officer. I have my license, registration, and insurance ready if you need them."
    },
    {
        "purpose": "If asked about your destination or activities",
        "text": "I prefer to exercise my right to remain silent. Am I free to go?"
    },
    {
        "purpose": "If officer requests to search your vehicle",
        "text": "I do not consent to any searches. I am exercising my Fourth Amendment rights."
    }
]'::jsonb);
*/
