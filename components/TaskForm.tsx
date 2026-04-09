import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const COLOR_PALETTE = [
  '#FF3B30',
  '#FF9500',
  '#FFCC00',
  '#34C759',
  '#007AFF',
  '#5856D6',
  '#AF52DE',
  '#FF2D55',
];

function parseDateInput(raw: string): string | null {
  const cleaned = raw.replace(/\D/g, '');
  if (cleaned.length !== 8) return null;

  const day = parseInt(cleaned.slice(0, 2), 10);
  const month = parseInt(cleaned.slice(2, 4), 10);
  const year = parseInt(cleaned.slice(4, 8), 10);

  if (month < 1 || month > 12 || day < 1 || day > 31 || year < 2000) return null;

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date.toISOString();
}

function formatDateDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function formatDateForInput(iso: string) {
  if (!iso) return '';
  const date = new Date(iso);
  if (isNaN(date.getTime())) return '';
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export interface TaskFormData {
  title: string;
  description: string | null;
  dueDate: string | null;
  color: string | null;
}

interface TaskFormProps {
  initialValues?: TaskFormData;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  formTitle?: string;
}

export default function TaskForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = 'Enregistrer',
  formTitle,
}: TaskFormProps) {
  const [titleInput, setTitleInput] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [dateInput, setDateInput] = useState('');
  const [color, setColor] = useState<string | null>(initialValues?.color || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setTitleInput(initialValues.title || '');
      setDescription(initialValues.description || '');
      setColor(initialValues.color || null);
      if (initialValues.dueDate) {
        setDateInput(formatDateForInput(initialValues.dueDate));
      } else {
        setDateInput('');
      }
    }
  }, [initialValues]);

  function handleDateChange(text: string) {
    const formatted = formatDateDisplay(text);
    setDateInput(formatted);
    if (dateError) setDateError('');
  }

  async function handleSubmit() {
    if (!titleInput.trim()) {
      Alert.alert('Titre requis', 'Veuillez saisir un titre pour la tâche.');
      return;
    }

    let dueDate: string | undefined = undefined;
    if (dateInput.length > 0) {
      const parsed = parseDateInput(dateInput);
      if (!parsed) {
        setDateError('Format invalide. Utilisez JJ/MM/AAAA.');
        return;
      }
      dueDate = parsed;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: titleInput.trim(),
        description: description.trim() || null,
        dueDate: dueDate ?? null,
        color: color ?? null,
      });
    } catch {
      Alert.alert('Erreur', 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">

        {formTitle ? (
          <View style={styles.header}>
            <Text style={styles.pageTitle}>{formTitle}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Titre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nom de la tâche"
          placeholderTextColor="#C7C7CC"
          value={titleInput}
          onChangeText={setTitleInput}
          autoFocus={!initialValues?.title}
          returnKeyType="next"
          maxLength={500}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          placeholder="Description (optionnelle)"
          placeholderTextColor="#C7C7CC"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          maxLength={2000}
        />

        <Text style={styles.label}>Date limite</Text>
        <TextInput
          style={[styles.input, dateError ? styles.inputError : null]}
          placeholder="JJ/MM/AAAA"
          placeholderTextColor="#C7C7CC"
          value={dateInput}
          onChangeText={handleDateChange}
          keyboardType="numeric"
          maxLength={10}
        />
        {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}

        <Text style={styles.label}>Couleur</Text>
        <View style={styles.swatches}>
          <Pressable
            onPress={() => setColor(null)}
            style={[styles.swatch, styles.swatchNone, color === null && styles.swatchSelected]}>
            <Text style={styles.swatchNoneText}>Aucune</Text>
          </Pressable>
          {COLOR_PALETTE.map((hex) => (
            <Pressable
              key={hex}
              onPress={() => setColor(hex)}
              style={[
                styles.swatch,
                { backgroundColor: hex },
                color === hex && styles.swatchSelected,
              ]}
            />
          ))}
        </View>

        <Pressable
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>{submitLabel}</Text>
          )}
        </Pressable>

        <Pressable
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={isSubmitting}>
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </Pressable>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: Platform.OS === 'ios' ? 10 : 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6C6C70',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  swatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: '#000000',
  },
  swatchNone: {
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  swatchNoneText: {
    fontSize: 13,
    color: '#6C6C70',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 36,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#FF3B30',
    fontSize: 17,
    fontWeight: '600',
  },
});
