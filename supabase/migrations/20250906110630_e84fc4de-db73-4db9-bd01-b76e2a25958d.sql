-- Create a security definer function for system notification creation
CREATE OR REPLACE FUNCTION public.create_system_notification(
    target_user_id UUID,
    notification_type TEXT,
    notification_title TEXT,
    notification_message TEXT,
    batch_id UUID DEFAULT NULL,
    transaction_id UUID DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_notification_id UUID;
BEGIN
    -- Insert the notification
    INSERT INTO public.notifications (
        user_id,
        type,
        title,
        message,
        related_batch_id,
        related_transaction_id
    ) VALUES (
        target_user_id,
        notification_type,
        notification_title,
        notification_message,
        batch_id,
        transaction_id
    ) RETURNING id INTO new_notification_id;
    
    RETURN new_notification_id;
END;
$$;

-- Create INSERT policy that only allows authenticated users to create notifications for themselves
-- This prevents users from creating fake notifications for other users
CREATE POLICY "Users can create notifications for themselves" 
ON public.notifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Grant execute permissions on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.create_system_notification TO authenticated;

-- Add a trigger function to automatically create notifications for important events
CREATE OR REPLACE FUNCTION public.notify_transaction_participants()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Notify the sender
    PERFORM public.create_system_notification(
        NEW.from_user_id,
        'transaction',
        'Transaction Created',
        CASE 
            WHEN NEW.transaction_type = 'sale' THEN 'You initiated a sale transaction'
            WHEN NEW.transaction_type = 'transfer' THEN 'You initiated a transfer'
            ELSE 'You created a new transaction'
        END,
        NEW.batch_id,
        NEW.id
    );
    
    -- Notify the recipient
    PERFORM public.create_system_notification(
        NEW.to_user_id,
        'transaction',
        'New Transaction Received',
        CASE 
            WHEN NEW.transaction_type = 'sale' THEN 'You received a purchase request'
            WHEN NEW.transaction_type = 'transfer' THEN 'A batch has been transferred to you'
            ELSE 'You have a new transaction'
        END,
        NEW.batch_id,
        NEW.id
    );
    
    RETURN NEW;
END;
$$;

-- Create trigger for transaction notifications
CREATE TRIGGER transaction_notification_trigger
    AFTER INSERT ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_transaction_participants();