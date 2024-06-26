import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ApolloError, useApolloClient, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { useNewToast } from '../toastContext';
import { DeleteArtistMutation } from '../../requests/mutations';
import { useAppDispatch } from '../../redux';
import { resetProfile } from '../../utils';

const ProfileDeleteAccount = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation(['common', 'translation']);
  const newToast = useNewToast();
  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);
  const modalId = 'delete_artist_modal';
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const client = useApolloClient();

  const [deleteAccountAction, {
    loading: deleteAccountLoading,
    error: deleteAccountError,
  }] = useMutation(DeleteArtistMutation);

  useEffect(() => {
    if (deleteAccountError) {
      newToast('error', deleteAccountError.message);
    }
  }, [newToast, deleteAccountLoading, deleteAccountError]);

  const handleDelete = async () => {
    try {
      const response = await deleteAccountAction();

      if (response) {
        resetProfile({
          client,
          dispatch,
          newToast,
          successMessage: t('DELETE_ACCOUNT_SUCCESS'),
        });

        navigate('/logout', { replace: true });
        closeModal();
      }
    } catch (error) {
      if (error instanceof ApolloError) {
        if (error.graphQLErrors[0].extensions?.code === 'ARTIST_NAME_ALREADY_EXISTS') {
          newToast('error', error.message);
          return;
        }

        if (error.graphQLErrors[0].extensions?.code === 'ARTIST_EMAIL_ALREADY_EXISTS') {
          newToast('error', error.message);
          return;
        }
      }

      if (deleteAccountError) {
        newToast('error', deleteAccountError.message);
        return;
      }

      newToast('error', t('DELETE_ACCOUNT_ERROR', { ns: 'translation' }));
    }
  };

  return (
    <>
      {/* Delete Account Button */}
      <div className="absolute bottom-0 right-0 mb-4 mr-4">
        <button
          type="button"
          className="btn border-stone-700 border hover:btn-error"
          onClick={openModal}
        >
          {t('DELETE_ACCOUNT_BUTTON_LABEL', { ns: 'translation' })}
        </button>
      </div>

      {isOpen && (
        <dialog id={modalId} className="modal" open>
          <form method="dialog" className="modal-box border-2 border-stone-700">
            <p>{t('DELETE_ACCOUNT_CONFIRM', { ns: 'translation' })}</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-end mt-4">
              <button
                type="button"
                className="btn btn-outline border-stone-700 border mr-2 w-full sm:w-auto"
                onClick={closeModal}
              >
                {t('CANCEL', { ns: 'common' })}
              </button>
              <button
                type="button"
                className="btn btn-error w-full sm:w-auto"
                onClick={handleDelete}
              >
                {t('CONFIRM', { ns: 'common' })}
              </button>
            </div>
          </form>

          {/* Modal backdrop */}
          <form method="dialog" className="modal-backdrop backdrop-brightness-50 backdrop-blur-[1px]">
            <button
              onClick={closeModal}
              type="submit"
            >
              {t('CLOSE')}
            </button>
          </form>
        </dialog>
      )}
    </>
  );
};

export default ProfileDeleteAccount;
