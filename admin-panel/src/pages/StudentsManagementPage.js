import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTheme, spacing, typography, borderRadius, shadows } from '../constants/theme';
import AdminLayout from '../components/AdminLayout';
import GlassCard from '../components/GlassCard';
import StatCard from '../components/StatCard';
import ModernButton from '../components/ModernButton';
import {
  getAllStudents,
  calculateAverageAttendance,
  getAttendanceStatus,
  calculateStudentStats,
  filterStudents,
  sortStudentsByAttendance,
  getUniqueDepartments,
  getUniqueYears,
} from '../services/studentsService';

export default function StudentsManagementPage() {
  const { isDarkMode } = useAuth();
  const theme = getTheme(isDarkMode);

  // State
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    department: 'all',
    status: 'all',
    year: 'all',
  });
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [stats, setStats] = useState({ total: 0, good: 0, warning: 0, atRisk: 0 });

  // Load students
  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllStudents();
      setStudents(data);
      setFilteredStudents(data);
      setStats(calculateStudentStats(data));
    } catch (err) {
      console.error('Failed to load students:', err.code, err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Apply filters and search
  useEffect(() => {
    let result = filterStudents(students, searchQuery, filters);
    if (sortOrder) {
      result = sortStudentsByAttendance(result, sortOrder);
    }
    setFilteredStudents(result);
  }, [students, searchQuery, filters, sortOrder]);

  const departments = getUniqueDepartments(students);
  const years = getUniqueYears(students);

  return (
    <AdminLayout
      title="Students Management"
      subtitle="Monitor student attendance and academic performance"
    >
      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: spacing.lg,
        marginBottom: spacing.xl,
      }}>
        <StatCard
          label="Total Students"
          value={stats.total}
          icon="👨🎓"
          color="#3B82F6"
        />
        <StatCard
          label="Good Standing"
          value={stats.good}
          icon="✅"
          color="#10B981"
          trend={`${Math.round((stats.good / stats.total) * 100) || 0}%`}
        />
        <StatCard
          label="Warning"
          value={stats.warning}
          icon="⚠️"
          color="#F59E0B"
          trend={`${Math.round((stats.warning / stats.total) * 100) || 0}%`}
        />
        <StatCard
          label="At Risk"
          value={stats.atRisk}
          icon="🚨"
          color="#EF4444"
          trend={`${Math.round((stats.atRisk / stats.total) * 100) || 0}%`}
        />
      </div>

      {/* Filters & Search */}
      <GlassCard style={{ marginBottom: spacing.lg }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: spacing.md,
          alignItems: 'end',
        }}>
          {/* Search */}
          <div style={{ gridColumn: 'span 2', minWidth: 0 }}>
            <label style={{ ...typography.smallMedium, color: theme.text, display: 'block', marginBottom: spacing.xs }}>
              Search Students
            </label>
            <input
              type="text"
              placeholder="🔍  Search by name, ID, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: `1px solid ${theme.border}`,
                borderRadius: borderRadius.lg,
                background: theme.surface,
                color: theme.text,
                ...typography.body,
                outline: 'none',
              }}
            />
          </div>

          {/* Department Filter */}
          <div>
            <label style={{ ...typography.smallMedium, color: theme.text, display: 'block', marginBottom: spacing.xs }}>
              Department
            </label>
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: `1px solid ${theme.border}`,
                borderRadius: borderRadius.lg,
                background: theme.surface,
                color: theme.text,
                ...typography.body,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label style={{ ...typography.smallMedium, color: theme.text, display: 'block', marginBottom: spacing.xs }}>
              Year
            </label>
            <select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: `1px solid ${theme.border}`,
                borderRadius: borderRadius.lg,
                background: theme.surface,
                color: theme.text,
                ...typography.body,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="all">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label style={{ ...typography.smallMedium, color: theme.text, display: 'block', marginBottom: spacing.xs }}>
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: `1px solid ${theme.border}`,
                borderRadius: borderRadius.lg,
                background: theme.surface,
                color: theme.text,
                ...typography.body,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="all">All Status</option>
              <option value="good">Good (≥75%)</option>
              <option value="warning">Warning (65-74%)</option>
              <option value="at risk">At Risk (&lt;65%)</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label style={{ ...typography.smallMedium, color: theme.text, display: 'block', marginBottom: spacing.xs }}>
              Sort by Attendance
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: `1px solid ${theme.border}`,
                borderRadius: borderRadius.lg,
                background: theme.surface,
                color: theme.text,
                ...typography.body,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="desc">Highest First</option>
              <option value="asc">Lowest First</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(searchQuery || filters.department !== 'all' || filters.status !== 'all' || filters.year !== 'all') && (
            <ModernButton
              variant="ghost"
              size="small"
              onClick={() => {
                setSearchQuery('');
                setFilters({ department: 'all', status: 'all', year: 'all' });
              }}
            >
              Clear Filters ×
            </ModernButton>
          )}
        </div>
      </GlassCard>

      {/* Results Count */}
      <div style={{ marginBottom: spacing.md }}>
        <span style={{ ...typography.body, color: theme.textSecondary }}>
          Showing {filteredStudents.length} of {students.length} students
        </span>
      </div>

      {/* Students Grid */}
      {loading ? (
        <LoadingState theme={theme} />
      ) : error ? (
        <GlassCard style={{ textAlign: 'center', padding: spacing.xl }}>
          <div style={{ fontSize: 48, marginBottom: spacing.md }}>⚠️</div>
          <h3 style={{ ...typography.h3, color: '#EF4444', marginBottom: spacing.sm }}>Failed to load students</h3>
          <p style={{ ...typography.body, color: theme.textSecondary, fontFamily: 'monospace', fontSize: 13 }}>{error}</p>
          <ModernButton variant="primary" size="small" onClick={loadStudents} style={{ marginTop: spacing.md }}>Retry</ModernButton>
        </GlassCard>
      ) : filteredStudents.length === 0 ? (
        <EmptyState theme={theme} hasFilters={searchQuery || filters.department !== 'all' || filters.status !== 'all'} />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: spacing.lg,
        }}>
          {filteredStudents.map((student, index) => (
            <StudentCard
              key={student.id}
              student={student}
              theme={theme}
              index={index}
              onClick={() => setSelectedStudent(student)}
            />
          ))}
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          theme={theme}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </AdminLayout>
  );
}

// Student Card Component
function StudentCard({ student, theme, index, onClick }) {
  const avg = calculateAverageAttendance(student.attendance);
  const status = getAttendanceStatus(avg);
  const isAtRisk = status.label === 'At Risk';

  return (
    <div
      style={{
        background: theme.surface,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        boxShadow: shadows.md,
        border: isAtRisk ? `2px solid ${status.color}` : `1px solid ${theme.border}`,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        animation: `slideUp 0.3s ease ${index * 0.05}s both`,
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = shadows.lg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = shadows.md;
      }}
    >
      {/* At Risk Indicator */}
      {isAtRisk && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          background: status.color,
          color: '#fff',
          padding: '4px 12px',
          borderBottomLeftRadius: borderRadius.lg,
          ...typography.caption,
          fontWeight: '700',
        }}>
          🚨 URGENT
        </div>
      )}

      {/* Student Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: student.photoURL ? 'transparent' : `linear-gradient(135deg, ${status.color}, ${theme.primary})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: '700',
          fontSize: 20,
          flexShrink: 0,
          overflow: 'hidden',
          border: `3px solid ${status.bg}`,
        }}>
          {student.photoURL ? (
            <img src={student.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            (student.fullName || 'S')[0].toUpperCase()
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            ...typography.h4,
            color: theme.text,
            margin: 0,
            marginBottom: 2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {student.fullName || 'Unknown'}
          </h3>
          <p style={{
            ...typography.small,
            color: theme.textSecondary,
            margin: 0,
            fontFamily: 'monospace',
          }}>
            {student.studentId || '—'}
          </p>
        </div>
      </div>

      {/* Student Info */}
      <div style={{ marginBottom: spacing.md }}>
        <InfoRow icon="📧" label={student.email} theme={theme} />
        <InfoRow icon="🏛️" label={student.department || '—'} theme={theme} />
        <InfoRow icon="📚" label={`${student.year || '—'} • ${student.semester || '—'}`} theme={theme} />
      </div>

      {/* Attendance Progress */}
      <div style={{ marginBottom: spacing.sm }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs }}>
          <span style={{ ...typography.smallMedium, color: theme.text }}>Average Attendance</span>
          <span style={{ ...typography.h4, color: status.color, fontWeight: '700' }}>{avg}%</span>
        </div>
        <div style={{
          height: 8,
          background: theme.border,
          borderRadius: borderRadius.full,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${avg}%`,
            background: `linear-gradient(90deg, ${status.color}, ${status.color}dd)`,
            borderRadius: borderRadius.full,
            transition: 'width 0.6s ease',
          }} />
        </div>
      </div>

      {/* Status Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing.xs,
        background: status.bg,
        color: status.color,
        padding: '6px 12px',
        borderRadius: borderRadius.full,
        ...typography.captionMedium,
        fontWeight: '700',
      }}>
        {status.label === 'Good' && '✅'}
        {status.label === 'Warning' && '⚠️'}
        {status.label === 'At Risk' && '🚨'}
        {status.label}
      </div>
    </div>
  );
}

// Info Row Component
function InfoRow({ icon, label, theme }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.xs,
    }}>
      <span style={{ fontSize: 14 }}>{icon}</span>
      <span style={{
        ...typography.small,
        color: theme.textSecondary,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {label}
      </span>
    </div>
  );
}

// Student Detail Modal
function StudentDetailModal({ student, theme, onClose }) {
  const avg = calculateAverageAttendance(student.attendance);
  const status = getAttendanceStatus(avg);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 16,
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.surface,
          borderRadius: borderRadius.xl,
          boxShadow: shadows.lg,
          width: '100%',
          maxWidth: 560,
          maxHeight: '90vh',
          overflowY: 'auto',
          border: `1px solid ${theme.border}`,
          animation: 'slideUp 0.25s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: `${spacing.lg}px ${spacing.xl}px`,
          borderBottom: `1px solid ${theme.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h3 style={{ ...typography.h3, color: theme.text, margin: 0 }}>Student Details</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: theme.textSecondary,
              lineHeight: 1,
              padding: 4,
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: spacing.xl }}>
          {/* Profile Section */}
          <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
            <div style={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              background: student.photoURL ? 'transparent' : `linear-gradient(135deg, ${status.color}, ${theme.primary})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: '700',
              fontSize: 36,
              margin: '0 auto 16px',
              overflow: 'hidden',
              border: `4px solid ${status.bg}`,
            }}>
              {student.photoURL ? (
                <img src={student.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                (student.fullName || 'S')[0].toUpperCase()
              )}
            </div>
            <h2 style={{ ...typography.h2, color: theme.text, margin: '0 0 4px' }}>{student.fullName || 'Unknown'}</h2>
            <p style={{ ...typography.body, color: theme.textSecondary, margin: 0, fontFamily: 'monospace' }}>
              {student.studentId || '—'}
            </p>
          </div>

          {/* Overall Attendance */}
          <div style={{
            background: status.bg,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            marginBottom: spacing.lg,
            border: `2px solid ${status.color}30`,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ ...typography.caption, color: theme.textSecondary, marginBottom: spacing.xs, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Overall Attendance
              </div>
              <div style={{ ...typography.h1, color: status.color, fontWeight: '700', marginBottom: spacing.sm }}>
                {avg}%
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing.xs,
                background: status.color,
                color: '#fff',
                padding: '6px 16px',
                borderRadius: borderRadius.full,
                ...typography.bodyMedium,
                fontWeight: '700',
              }}>
                {status.label === 'Good' && '✅'}
                {status.label === 'Warning' && '⚠️'}
                {status.label === 'At Risk' && '🚨'}
                {status.label}
              </div>
            </div>
          </div>

          {/* Subject-wise Attendance */}
          {student.attendance && Object.keys(student.attendance).length > 0 && (
            <div style={{ marginBottom: spacing.lg }}>
              <h4 style={{ ...typography.h4, color: theme.text, marginBottom: spacing.md }}>
                📊 Subject-wise Attendance
              </h4>
              {Object.entries(student.attendance).map(([subject, percentage]) => {
                const subStatus = getAttendanceStatus(percentage);
                return (
                  <div key={subject} style={{ marginBottom: spacing.md }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.xs }}>
                      <span style={{ ...typography.smallMedium, color: theme.text }}>{subject}</span>
                      <span style={{ ...typography.bodyMedium, color: subStatus.color, fontWeight: '700' }}>
                        {percentage}%
                      </span>
                    </div>
                    <div style={{
                      height: 6,
                      background: theme.border,
                      borderRadius: borderRadius.full,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${percentage}%`,
                        background: subStatus.color,
                        borderRadius: borderRadius.full,
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Student Info */}
          <div>
            <h4 style={{ ...typography.h4, color: theme.text, marginBottom: spacing.md }}>
              📋 Student Information
            </h4>
            {[
              ['Email', student.email],
              ['Department', student.department],
              ['Year', student.year],
              ['Semester', student.semester],
              ['Phone', student.phoneNumber],
              ['Gender', student.gender],
              ['Blood Group', student.bloodGroup],
              ['Date of Birth', student.dateOfBirth],
            ].map(([label, value]) => value ? (
              <div key={label} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: `${spacing.sm}px 0`,
                borderBottom: `1px solid ${theme.border}`,
              }}>
                <span style={{ ...typography.smallMedium, color: theme.textSecondary }}>{label}</span>
                <span style={{ ...typography.smallMedium, color: theme.text, textAlign: 'right' }}>{value}</span>
              </div>
            ) : null)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading State
function LoadingState({ theme }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
      gap: spacing.lg,
    }}>
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} style={{
          background: theme.surface,
          borderRadius: borderRadius.xl,
          padding: spacing.lg,
          height: 280,
          animation: 'pulse 1.5s ease-in-out infinite',
          opacity: 1 - i * 0.08,
        }} />
      ))}
    </div>
  );
}

// Empty State
function EmptyState({ theme, hasFilters }) {
  return (
    <GlassCard style={{ textAlign: 'center', padding: spacing.xxl }}>
      <div style={{ fontSize: 64, marginBottom: spacing.lg }}>
        {hasFilters ? '🔍' : '👨🎓'}
      </div>
      <h3 style={{ ...typography.h3, color: theme.text, marginBottom: spacing.sm }}>
        {hasFilters ? 'No students found' : 'No students yet'}
      </h3>
      <p style={{ ...typography.body, color: theme.textSecondary, maxWidth: 400, margin: '0 auto' }}>
        {hasFilters
          ? 'Try adjusting your search or filters to find students.'
          : 'Students will appear here once they are added to the system.'}
      </p>
    </GlassCard>
  );
}
