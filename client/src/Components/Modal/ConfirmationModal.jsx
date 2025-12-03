import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useCustomTranslation } from '../../hooks/useCustomTranslation';

/**
 * ConfirmationModal Component
 * 
 * A reusable confirmation modal for EIC request management actions.
 * Supports different action types with dynamic styling and optional reason field.
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Handler for closing modal (cancel)
 * @param {function} onConfirm - Handler for confirmation with optional reason parameter
 * @param {string} title - Modal title
 * @param {string} action - Action type: 'approve', 'reject', 'cancel', 'pickup', 'return', 'no_return', 'no_pickup'
 * @param {object} request - Request object with item, requestor, quantity, dates
 * @param {boolean} requireReason - Whether reason field is required
 * @param {boolean} isDark - Dark mode flag
 * @param {boolean} isLoading - Loading state during API call
 */
const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    action = 'approve',
    request,
    requireReason = false,
    isDark = false,
    isLoading = false,
}) => {
    const { t } = useCustomTranslation();
    const [reason, setReason] = useState('');
    const [localLoading, setLocalLoading] = useState(false);
    const modalRef = useRef(null);
    const reasonInputRef = useRef(null);

    // Default title if not provided
    const modalTitle = title || t('modal.confirm_action');

    // Action configuration
    const actionConfig = {
        approve: {
            icon: 'fa-check-circle',
            color: '#16a34a',
            bgColor: '#dcfce7',
            gradient: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            label: t('common.approve'),
            statusLabel: t('status.approved'),
        },
        reject: {
            icon: 'fa-times-circle',
            color: '#dc2626',
            bgColor: '#fee2e2',
            gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            label: t('common.reject'),
            statusLabel: t('status.rejected'),
        },
        cancel: {
            icon: 'fa-ban',
            color: '#d97706',
            bgColor: '#fef3c7',
            gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
            label: t('common.cancel'),
            statusLabel: t('status.cancelled'),
        },
        pickup: {
            icon: 'fa-hand-holding',
            color: '#3b82f6',
            bgColor: '#dbeafe',
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            label: 'Mark Picked Up',
            statusLabel: 'Picked Up',
        },
        return: {
            icon: 'fa-undo',
            color: '#16a34a',
            bgColor: '#dcfce7',
            gradient: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            label: 'Mark Returned',
            statusLabel: 'Returned',
        },
        no_return: {
            icon: 'fa-exclamation-triangle',
            color: '#dc2626',
            bgColor: '#fee2e2',
            gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            label: 'Mark No Return',
            statusLabel: 'No Return',
        },
        no_pickup: {
            icon: 'fa-user-times',
            color: '#d97706',
            bgColor: '#fef3c7',
            gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
            label: 'Mark No Pickup',
            statusLabel: 'No Pickup',
        },
    };

    const config = actionConfig[action] || actionConfig.approve;

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen && !localLoading) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Focus reason input if required
            if (requireReason && reasonInputRef.current) {
                setTimeout(() => reasonInputRef.current?.focus(), 100);
            }
        }

        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose, requireReason, localLoading]);

    // Reset reason when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setReason('');
            setLocalLoading(false);
        }
    }, [isOpen]);

    // Handle confirmation
    const handleConfirm = async () => {
        if (requireReason && !reason.trim()) {
            reasonInputRef.current?.focus();
            return;
        }

        setLocalLoading(true);
        try {
            await onConfirm(reason.trim() || null);
            // Parent component will close modal on success
        } catch (error) {
            console.error('Confirmation error:', error);
            setLocalLoading(false);
        }
    };

    // Handle Enter key in reason field
    const handleReasonKeyDown = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            handleConfirm();
        }
    };

    if (!isOpen) return null;

    const loading = isLoading || localLoading;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'fadeIn 0.3s ease-out',
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget && !loading) {
                    onClose();
                }
            }}
        >
            <div
                ref={modalRef}
                style={{
                    background: isDark ? '#1e293b' : 'white',
                    borderRadius: '1.5rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    padding: 0,
                    maxWidth: '480px',
                    width: '90vw',
                    overflow: 'hidden',
                    animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        background: config.gradient,
                        padding: '2rem 2.5rem 1.5rem 2.5rem',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '50%',
                            width: '4rem',
                            height: '4rem',
                            margin: '0 auto 1rem auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <i
                            className={`fas ${config.icon}`}
                            style={{
                                fontSize: '2rem',
                                color: 'white',
                                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))',
                            }}
                        />
                    </div>
                    <h3
                        style={{
                            margin: 0,
                            color: 'white',
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                    >
                        {title}
                    </h3>
                </div>

                {/* Content */}
                <div style={{ padding: '2rem 2.5rem' }}>
                    <div
                        style={{
                            background: isDark ? '#334155' : '#f8fafc',
                            border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`,
                            borderRadius: '0.75rem',
                            padding: '1.5rem',
                            marginBottom: '1.5rem',
                        }}
                    >
                        {/* Request Details */}
                        {request && (
                            <div style={{ marginBottom: '1rem' }}>
                                <div
                                    style={{
                                        fontSize: '0.875rem',
                                        color: isDark ? '#94a3b8' : '#64748b',
                                        fontWeight: 500,
                                        marginBottom: '0.25rem',
                                    }}
                                >
                                    EQUIPMENT REQUEST
                                </div>
                                <div
                                    style={{
                                        fontSize: '1.125rem',
                                        color: isDark ? '#f1f5f9' : '#1e293b',
                                        fontWeight: 600,
                                        marginBottom: '0.5rem',
                                    }}
                                >
                                    "{request.itemName || 'Unknown Item'}"
                                </div>
                                <div
                                    style={{
                                        fontSize: '0.875rem',
                                        color: isDark ? '#94a3b8' : '#64748b',
                                        marginBottom: '0.5rem',
                                    }}
                                >
                                    Requested by:{' '}
                                    <strong style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>
                                        {request.requestorName || 'Unknown User'}
                                    </strong>
                                </div>

                                {/* User's Request Note */}
                                {request.requestNote && (
                                    <div
                                        style={{
                                            marginTop: '0.75rem',
                                            padding: '0.75rem',
                                            background: isDark ? '#1e293b' : '#f0f9ff',
                                            border: `1px solid ${isDark ? '#334155' : '#bfdbfe'}`,
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        <div
                                            style={{
                                                color: isDark ? '#60a5fa' : '#2563eb',
                                                fontWeight: 600,
                                                marginBottom: '0.25rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                            }}
                                        >
                                            <i className="fas fa-comment-dots" />
                                            User's Note:
                                        </div>
                                        <div
                                            style={{
                                                color: isDark ? '#cbd5e1' : '#1e293b',
                                                fontStyle: 'italic',
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            "{request.requestNote}"
                                        </div>
                                    </div>
                                )}

                                {/* Quantity Info */}
                                {request.quantity && (
                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: '1rem',
                                            marginTop: '1rem',
                                            padding: '0.75rem',
                                            background: isDark ? '#1e293b' : '#f1f5f9',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        <div style={{ flex: 1, textAlign: 'center' }}>
                                            <div
                                                style={{
                                                    color: isDark ? '#94a3b8' : '#64748b',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                Requested
                                            </div>
                                            <div
                                                style={{
                                                    color: isDark ? '#f1f5f9' : '#1e293b',
                                                    fontWeight: 700,
                                                    fontSize: '1.25rem',
                                                }}
                                            >
                                                {request.quantity}
                                            </div>
                                        </div>
                                        {request.currentStock !== undefined && (
                                            <>
                                                <div
                                                    style={{
                                                        width: '1px',
                                                        background: isDark ? '#475569' : '#cbd5e1',
                                                    }}
                                                />
                                                <div style={{ flex: 1, textAlign: 'center' }}>
                                                    <div
                                                        style={{
                                                            color: isDark ? '#94a3b8' : '#64748b',
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        Available
                                                    </div>
                                                    <div
                                                        style={{
                                                            color:
                                                                request.currentStock === 0
                                                                    ? '#dc2626'
                                                                    : request.currentStock < 5
                                                                    ? '#d97706'
                                                                    : '#16a34a',
                                                            fontWeight: 700,
                                                            fontSize: '1.25rem',
                                                        }}
                                                    >
                                                        {request.currentStock}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Insufficient stock warning */}
                                {request.quantity > request.currentStock && action === 'approve' && (
                                    <div
                                        style={{
                                            marginTop: '0.75rem',
                                            padding: '0.75rem',
                                            background: '#fef2f2',
                                            border: '1px solid #fecaca',
                                            borderRadius: '0.5rem',
                                            color: '#dc2626',
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            textAlign: 'center',
                                        }}
                                    >
                                        ⚠️ Warning: Insufficient stock for this request
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Confirmation */}
                        <div
                            style={{
                                borderTop: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`,
                                paddingTop: '1rem',
                                textAlign: 'center',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '1rem',
                                    color: isDark ? '#cbd5e1' : '#374151',
                                    lineHeight: 1.5,
                                }}
                            >
                                You are about to change the request status to:
                                <br />
                                <span
                                    style={{
                                        display: 'inline-block',
                                        marginTop: '0.5rem',
                                        padding: '0.5rem 1rem',
                                        background: config.bgColor,
                                        color: config.color,
                                        borderRadius: '0.5rem',
                                        fontWeight: 600,
                                        fontSize: '1.125rem',
                                    }}
                                >
                                    {config.statusLabel}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Reason Field */}
                    {requireReason && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: isDark ? '#f1f5f9' : '#374151',
                                    marginBottom: '0.5rem',
                                }}
                            >
                                {t('distribution.notes')} {requireReason && <span style={{ color: '#dc2626' }}>*</span>}
                            </label>
                            <textarea
                                ref={reasonInputRef}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                onKeyDown={handleReasonKeyDown}
                                placeholder={t('distribution.describe_purpose')}
                                disabled={loading}
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    fontSize: '0.875rem',
                                    border: `2px solid ${isDark ? '#475569' : '#e2e8f0'}`,
                                    borderRadius: '0.5rem',
                                    background: isDark ? '#1e293b' : 'white',
                                    color: isDark ? '#f1f5f9' : '#1e293b',
                                    resize: 'vertical',
                                    fontFamily: 'inherit',
                                    outline: 'none',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = config.color;
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = isDark ? '#475569' : '#e2e8f0';
                                }}
                            />
                            <div
                                style={{
                                    fontSize: '0.75rem',
                                    color: isDark ? '#94a3b8' : '#64748b',
                                    marginTop: '0.25rem',
                                }}
                            >
                                Press Ctrl+Enter to submit
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div
                        style={{
                            display: 'flex',
                            gap: '0.75rem',
                            justifyContent: 'center',
                        }}
                    >
                        <button
                            onClick={onClose}
                            disabled={loading}
                            style={{
                                flex: 1,
                                background: isDark ? '#334155' : '#f1f5f9',
                                border: `2px solid ${isDark ? '#475569' : '#e2e8f0'}`,
                                color: isDark ? '#94a3b8' : '#64748b',
                                padding: '0.875rem 1.5rem',
                                borderRadius: '0.75rem',
                                fontWeight: 600,
                                fontSize: '1rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                opacity: loading ? 0.5 : 1,
                            }}
                        >
                            <i className="fas fa-times" />
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={loading || (requireReason && !reason.trim())}
                            style={{
                                flex: 1,
                                background: config.gradient,
                                border: 'none',
                                color: 'white',
                                padding: '0.875rem 1.5rem',
                                borderRadius: '0.75rem',
                                fontWeight: 600,
                                fontSize: '1rem',
                                cursor:
                                    loading || (requireReason && !reason.trim())
                                        ? 'not-allowed'
                                        : 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                boxShadow: `0 4px 14px 0 ${config.color}40`,
                                opacity: loading || (requireReason && !reason.trim()) ? 0.5 : 1,
                            }}
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin" />
                                    {t('common.processing')}
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-check" />
                                    {config.label}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Animations */}
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from { 
                            opacity: 0; 
                            transform: translateY(40px) scale(0.95); 
                        }
                        to { 
                            opacity: 1; 
                            transform: translateY(0) scale(1); 
                        }
                    }
                `}
            </style>
        </div>
    );
};

ConfirmationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string,
    action: PropTypes.oneOf([
        'approve',
        'reject',
        'cancel',
        'pickup',
        'return',
        'no_return',
        'no_pickup',
    ]),
    request: PropTypes.shape({
        itemName: PropTypes.string,
        requestorName: PropTypes.string,
        quantity: PropTypes.number,
        currentStock: PropTypes.number,
        requestNote: PropTypes.string,
    }),
    requireReason: PropTypes.bool,
    isDark: PropTypes.bool,
    isLoading: PropTypes.bool,
};

export default ConfirmationModal;
